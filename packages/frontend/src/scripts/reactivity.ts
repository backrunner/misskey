import { Ref, watch } from 'vue';

export const syncRef = (a: Ref<any>, b: Ref<any>) => {
	const cancelSync = watch(a, () => {
		b.value = a.value;
	});
	return cancelSync;
}
