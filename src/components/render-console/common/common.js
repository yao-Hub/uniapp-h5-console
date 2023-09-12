export function highestZIndex() {
  const elements = document.querySelectorAll('*');
  let highestZIndex = 998;

  elements.forEach((element) => {
    const zIndex = parseInt(getComputedStyle(element).zIndex);
    if (!isNaN(zIndex) && zIndex > highestZIndex) {
      highestZIndex = zIndex;
    }
  });

  return highestZIndex + 1;
};