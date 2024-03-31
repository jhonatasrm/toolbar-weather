const updateManifestText = () => {
    const textElements = document.querySelectorAll('[data-manifest]');
    textElements.forEach(element => {
        const manifestKey = element.dataset.manifest;
        if (Manifest.hasOwnProperty(manifestKey)) {
            element.textContent = Manifest[manifestKey];
        }
    });
};

const updateI18nText = () => {
    const textElements = document.querySelectorAll('[data-i18n]');
    textElements.forEach(element => {
        const i18nKey = element.dataset.i18n;
        const i18nMessage = browser.i18n.getMessage(i18nKey);
        if (i18nMessage) {
            element.innerText = i18nMessage;
        }
    });
};

updateManifestText();
updateI18nText();