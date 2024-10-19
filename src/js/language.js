// Function to update text content using data from a manifest object.
// It selects all elements with the 'data-manifest' attribute and replaces their text content
// with the corresponding value from the 'Manifest' object based on the attribute's value.
const updateManifestText = () => {
    const textElements = document.querySelectorAll('[data-manifest]');
    textElements.forEach(element => {
        const manifestKey = element.dataset.manifest;
        if (Manifest.hasOwnProperty(manifestKey)) {
            element.textContent = Manifest[manifestKey];
        }
    });
};

// Function to update text content and placeholders using internationalization (i18n) strings.
// It updates elements with 'data-i18n' for text content and 'data-i18n-placeholder' for placeholder attributes.
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

// Call both functions to update the manifest text and i18n text immediately after the script runs.
updateManifestText();
updateI18nText();