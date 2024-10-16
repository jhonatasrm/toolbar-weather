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
    const textElements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
    
    textElements.forEach(element => {
        if (element.dataset.i18n) {
            const i18nKey = element.dataset.i18n;
            const i18nMessage = browser.i18n.getMessage(i18nKey);
            if (i18nMessage) {
                element.innerText = i18nMessage;
            }
        }

        if (element.dataset.i18nPlaceholder) {
            const i18nPlaceholderKey = element.dataset.i18nPlaceholder;
            const i18nPlaceholderMessage = browser.i18n.getMessage(i18nPlaceholderKey);
            if (i18nPlaceholderMessage) {
                element.setAttribute('placeholder', i18nPlaceholderMessage);
            }
        }
    });
};

updateManifestText();
updateI18nText();
