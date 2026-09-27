import type { HealthStatus, IncidentSeverity, IncidentStatus } from '@/types';
import { useTranslation } from 'react-i18next';

interface StatusIndicatorProps {
	status: HealthStatus | IncidentSeverity | IncidentStatus;
	size?: 'sm' | 'md' | 'lg';
	showLabel?: boolean;
}

const statusI18nKeys: Record<string, string> = {
	healthy: 'status.operational',
	degraded: 'status.degraded',
	unhealthy: 'status.down',
	critical: 'severity.critical',
	major: 'severity.major',
	minor: 'severity.minor',
	maintenance: 'severity.maintenance',
	investigating: 'status.investigating',
	identified: 'status.identified',
	monitoring: 'status.monitoring',
	resolved: 'status.resolved',
	draft: 'status.draft',
};

const statusColor: Record<string, string> = {
	healthy: 'bg-emerald-500',
	degraded: 'bg-amber-500',
	unhealthy: 'bg-rose-500',
	critical: 'bg-rose-600',
	major: 'bg-orange-500',
	minor: 'bg-amber-400',
	maintenance: 'bg-slate-400',
	investigating: 'bg-rose-500',
	identified: 'bg-amber-500',
	monitoring: 'bg-blue-500',
	resolved: 'bg-emerald-500',
	draft: 'bg-slate-400',
};

const statusAnimate: Record<string, boolean> = {
	healthy: true,
	degraded: true,
	unhealthy: true,
};

const badgeColors: Record<string, string> = {
	healthy:
		'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
	degraded:
		'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
	unhealthy:
		'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
	critical:
		'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
	major:
		'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
	minor:
		'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
	maintenance:
		'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
	investigating:
		'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
	identified:
		'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
	monitoring:
		'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
	resolved:
		'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
	draft:
		'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
};

export default function StatusIndicator({
	status,
	size = 'md',
	showLabel = false,
}: StatusIndicatorProps) {
	const { t } = useTranslation();
	const key = statusI18nKeys[status];
	const label = key ? t(key) : status;
	const color = statusColor[status] || 'bg-slate-300';
	const animate = statusAnimate[status] || false;

	const sizeClasses = {
		sm: 'h-2 w-2',
		md: 'h-3 w-3',
		lg: 'h-4 w-4',
	};

	return (
		<div className="flex items-center gap-2">
			<span
				className={`inline-block rounded-full ${sizeClasses[size]} ${color} ${
					animate ? 'animate-pulse-soft' : ''
				}`}
			/>
			{showLabel && (
				<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
			)}
		</div>
	);
}

export function StatusBadge({
	status,
}: {
	status: HealthStatus | IncidentSeverity | IncidentStatus;
}) {
	const { t } = useTranslation();
	const key = statusI18nKeys[status];
	const label = key ? t(key) : status;

	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
				badgeColors[status] ||
				'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
			}`}
		>
			{label}
		</span>
	);
}
