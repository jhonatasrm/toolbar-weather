let textElements = document.querySelectorAll('[data-manifest]');
for (let element of textElements) {
    element.textContent = Manifest[element.dataset.manifest];
}

textElements = document.querySelectorAll('[data-i18n]');

for (let element of textElements) {
   element.innerHTML = browser.i18n.getMessage(element.dataset.i18n);
}