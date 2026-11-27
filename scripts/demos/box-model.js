(root) => {
  const form = root.querySelector('[data-box-form]');
  const px = number => `${number} px`;
  const update = () => {
    const width = form.elements.width.valueAsNumber;
    const padding = form.elements.padding.valueAsNumber;
    const border = form.elements.border.valueAsNumber;
    const extras = 2 * (padding + border);
    const scale = width + extras;
    for (const [name, value] of Object.entries({width, padding, border})) {
      form.querySelector(`[data-box-value="${name}"]`).value = px(value);
    }
    for (const section of root.querySelectorAll('[data-box-model]')) {
      const inner = section.dataset.boxModel === 'content' ? width : Math.max(0, width - extras);
      const outer = inner + extras;
      section.querySelector('[data-outer]').textContent = px(outer);
      section.querySelector('[data-inner]').textContent = px(inner);
      const bar = section.querySelector('.box-model-bar');
      bar.style.inlineSize = `${outer / scale * 100}%`;
      [border, padding, inner, padding, border].forEach((size, i) => { bar.children[i].style.flexGrow = size; });
    }
  };
  form.addEventListener('input', update);
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
