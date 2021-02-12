const newElement = (element, ...classes) => {
  const el = document.createElement(element);
  classes.forEach((c) => {
    if (c.trim() !== '') el.classList.add(c);
  });
  return el;
};
