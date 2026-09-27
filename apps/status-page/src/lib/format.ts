import i18n from '@/i18n';

function getLocale(): string {
	const lang = i18n.language;
	if (lang === 'zh-CN') return 'zh-CN';
	return 'en-US';
}

export function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString(getLocale(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function formatShortDateTime(iso: string): string {
	return new Date(iso).toLocaleString(getLocale(), {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function formatDateOnly(iso: string): string {
	return new Date(iso).toLocaleDateString(getLocale());
}

export function formatTimeOnly(iso: string): string {
	return new Date(iso).toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function formatTimeWithSeconds(iso: string): string {
	return new Date(iso).toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}
