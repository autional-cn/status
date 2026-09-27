import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// Locale files use flat dot-delimited keys (e.g. "app.title", "nav.status").
// keySeparator: false prevents i18next from splitting keys on '.' — required because the
// JSON keys contain literal dots that are NOT path separators (the resources are flat hashmaps).
i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: { 'zh-CN': { translation: zhCN }, 'en-US': { translation: enUS } },
		fallbackLng: 'zh-CN',
		supportedLngs: ['zh-CN', 'en-US'],
		keySeparator: false,
		interpolation: { escapeValue: false },
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
			lookupLocalStorage: 'status-page-lang',
		},
	});

i18n.on('languageChanged', (lng) => {
	document.documentElement.lang = lng === 'en-US' ? 'en' : 'zh-CN';
});

export default i18n;
