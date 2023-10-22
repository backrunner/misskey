import { Ref, ref } from "vue";

export const useHeightObserver = (element: HTMLElement): [Ref<number>, () => void] => {
  const elementHeight = ref<number>(element.clientHeight);

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      elementHeight.value = entry.target.clientHeight;
    }
  });

  resizeObserver.observe(element);

  const dispose = () => {
    resizeObserver.unobserve(element);
    resizeObserver.disconnect();
  };

  return [elementHeight, dispose];
}
