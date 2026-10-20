const languageToggle = document.querySelector('.language-toggle');
const translatableElements = document.querySelectorAll('[data-en][data-id]');
const ariaLabelElements = document.querySelectorAll('[data-en-aria][data-id-aria]');
const altTextElements = document.querySelectorAll('[data-en-alt][data-id-alt]');
const translatableMeta = document.querySelectorAll('[data-en-content][data-id-content]');
const currentLanguageLabel = document.querySelector('.language-current');
const nextLanguageLabel = document.querySelector('.language-next');

function setLanguage(language, { save = true } = {}) {
  const selectedLanguage = language === 'id' ? 'id' : 'en';
  const textAttribute = selectedLanguage === 'id' ? 'data-id' : 'data-en';
  const ariaAttribute = selectedLanguage === 'id' ? 'data-id-aria' : 'data-en-aria';
  const altAttribute = selectedLanguage === 'id' ? 'data-id-alt' : 'data-en-alt';
  const contentAttribute = selectedLanguage === 'id' ? 'data-id-content' : 'data-en-content';

  translatableElements.forEach((element) => {
    element.textContent = element.getAttribute(textAttribute);
  });

  ariaLabelElements.forEach((element) => {
    element.setAttribute('aria-label', element.getAttribute(ariaAttribute));
  });

  altTextElements.forEach((element) => {
    element.setAttribute('alt', element.getAttribute(altAttribute));
  });

  translatableMeta.forEach((element) => {
    element.setAttribute('content', element.getAttribute(contentAttribute));
  });

  document.documentElement.lang = selectedLanguage;
  languageToggle.setAttribute('aria-pressed', String(selectedLanguage === 'id'));
  languageToggle.setAttribute(
    'aria-label',
    selectedLanguage === 'id' ? 'Ganti bahasa ke English' : 'Switch language to Indonesian',
  );
  currentLanguageLabel.textContent = selectedLanguage.toUpperCase();
  nextLanguageLabel.textContent = selectedLanguage === 'id' ? 'EN' : 'ID';

  if (save) {
    try {
      localStorage.setItem('portfolio-language', selectedLanguage);
    } catch {
      // Language switching still works when browser storage is unavailable.
    }
  }
}

languageToggle.addEventListener('click', () => {
  setLanguage(document.documentElement.lang === 'en' ? 'id' : 'en');
});

let savedLanguage = 'en';
try {
  savedLanguage = localStorage.getItem('portfolio-language') === 'id' ? 'id' : 'en';
} catch {
  // Use English when browser storage is unavailable.
}
setLanguage(savedLanguage, { save: false });

document.querySelector('#year').textContent = new Date().getFullYear();
