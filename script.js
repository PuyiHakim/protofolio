const languageToggle = document.querySelector('.language-toggle');
const translatableElements = document.querySelectorAll('[data-en][data-id]');

function setLanguage(language) {
  const languageKey = language === 'id' ? 'data-id' : 'data-en';

  translatableElements.forEach((element) => {
    element.innerHTML = element.getAttribute(languageKey);
  });

  document.documentElement.lang = language;
  languageToggle.setAttribute('aria-pressed', String(language === 'id'));
  languageToggle.setAttribute(
    'aria-label',
    language === 'id' ? 'Ganti bahasa ke English' : 'Switch language to Indonesian',
  );
  localStorage.setItem('portfolio-language', language);
}

languageToggle.addEventListener('click', () => {
  const currentLanguage = document.documentElement.lang;
  setLanguage(currentLanguage === 'en' ? 'id' : 'en');
});

const savedLanguage = localStorage.getItem('portfolio-language');
if (savedLanguage === 'id') setLanguage('id');

document.querySelector('#year').textContent = new Date().getFullYear();
