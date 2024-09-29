import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import * as deepl from 'deepl-node';

dotenv.config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const BASE_LANGUAGE = 'ja-JP';

const translator = new deepl.Translator(DEEPL_API_KEY);

const DEEPL_SUPPORTED_LANGUAGES = {
  'AR': 'AR', 'BG': 'BG', 'CS': 'CS', 'DA': 'DA', 'DE': 'DE', 'EL': 'EL',
  'EN': 'EN-US', 'ES': 'ES', 'ET': 'ET', 'FI': 'FI', 'FR': 'FR', 'HU': 'HU',
  'ID': 'ID', 'IT': 'IT', 'JA': 'JA', 'KO': 'KO', 'LT': 'LT', 'LV': 'LV',
  'NB': 'NB', 'NL': 'NL', 'PL': 'PL', 'PT': 'PT-PT', 'RO': 'RO', 'RU': 'RU',
  'SK': 'SK', 'SL': 'SL', 'SV': 'SV', 'TR': 'TR', 'UK': 'UK', 'ZH': 'ZH-HANS'
};

function normalizeAndCheckLanguage(lang) {
  // Handle special cases
  if (lang === 'ja-JP') return 'JA';
  if (lang === 'zh-CN') return 'ZH-HANS';
  if (lang === 'zh-TW') return 'ZH-HANT';

  // Remove country code if present
  const normalizedLang = lang.split('-')[0].toUpperCase();

  if (normalizedLang in DEEPL_SUPPORTED_LANGUAGES) {
    return DEEPL_SUPPORTED_LANGUAGES[normalizedLang];
  } else {
    console.warn(`Warning: Language ${lang} is not supported by DeepL. Skipping translation.`);
    return null;
  }
}

async function detectLocalesDir() {
  const possibleDirs = [
    process.cwd(),
    path.join(process.cwd(), 'locales')
  ];

  for (const dir of possibleDirs) {
    try {
      const files = await fs.readdir(dir);
      if (files.includes(`${BASE_LANGUAGE}.yml`)) {
        return dir;
      }
    } catch (error) {
      // skip the target directory
    }
  }

  throw new Error('Locales directory not found');
}

async function translateText(text, targetLang) {
  if (!targetLang) return text;

  try {
    const result = await translator.translateText(text, null, targetLang);
    return result.text;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
}

async function updateLocales(targetLocales = []) {
  try {
    const LOCALES_DIR = await detectLocalesDir();
    console.log(`Locales directory detected: ${LOCALES_DIR}`);

    const baseContent = await fs.readFile(path.join(LOCALES_DIR, `${BASE_LANGUAGE}.yml`), 'utf8');
    const baseLocale = yaml.load(baseContent);

    const localeFiles = await fs.readdir(LOCALES_DIR);

    for (const file of localeFiles) {
			const targetFileNames = targetLocales.map(lang => `${lang}.yml`);
      if (!file.endsWith('.yml') || file === `${BASE_LANGUAGE}.yml`) continue;
      if (targetLocales.length > 0 && !targetFileNames.includes(file)) continue;

      const originalLang = path.basename(file, '.yml');
      const targetLang = normalizeAndCheckLanguage(originalLang);
      if (!targetLang) continue;

      const targetPath = path.join(LOCALES_DIR, file);
      const targetContent = await fs.readFile(targetPath, 'utf8');
      const targetLocale = yaml.load(targetContent);

      console.log(`\nUpdating ${originalLang} locale (DeepL: ${targetLang}):`);
      const updatedLocale = await updateLocaleRecursively(baseLocale, targetLocale, targetLang);

      await fs.writeFile(targetPath, yaml.dump(updatedLocale, { lineWidth: -1 }));
      console.log(`\nFinished updating ${file}`);
    }
  } catch (error) {
    console.error('Error updating locales:', error);
  }
}

async function updateLocaleRecursively(base, target, targetLang, currentPath = '') {
  const updated = { ...target };

  for (const [key, value] of Object.entries(base)) {
    if (key === '_lang_') continue;
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      updated[key] = await updateLocaleRecursively(value, target[key] || {}, targetLang, newPath);
    } else if (!(key in target) || target[key] === '') {
      const translatedValue = await translateText(value, targetLang);
      updated[key] = translatedValue;
      console.log(`Updated [${targetLang}] ${newPath}: "${value}" => "${translatedValue}"`);
    }
  }

  return updated;
}

// Parse command-line arguments
function parseArguments() {
  const args = process.argv.slice(2);
  const targetLocales = [];
  let i = 0;
  while (i < args.length) {
    if (args[i] === '-l') {
      i++;
      while (i < args.length && !args[i].startsWith('-')) {
        targetLocales.push(args[i]);
        i++;
      }
    } else {
      i++;
    }
  }
  return targetLocales;
}

// Main execution
const targetLocales = parseArguments();
console.log('Target locales:', targetLocales);

updateLocales(targetLocales);
