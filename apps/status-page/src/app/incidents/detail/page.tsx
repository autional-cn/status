import { useParams, Link } from 'react-router';
import { useIncident } from '@/hooks/use-system-status';
import { StatusBadge } from '@/components/StatusIndicator';
import {
	ArrowLeft,
	AlertTriangle,
	Wrench,
	Clock,
	Server,
	MessageSquare,
	Loader2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/lib/format';

function buildSeverityConfig(
	t: (key: string) => string,
): Record<
	string,
	{ icon: React.ReactNode; label: string; color: string; border: string; bg: string }
> {
	return {
		critical: {
			icon: <AlertTriangle size={20} />,
			label: t('incidents.criticalEvent'),
			color: 'text-rose-700 dark:text-rose-400',
			border: 'border-rose-200 dark:border-rose-800',
			bg: 'bg-rose-50 dark:bg-rose-900/20',
		},
		major: {
			icon: <AlertTriangle size={20} />,
			label: t('incidents.majorEvent'),
			color: 'text-orange-700 dark:text-orange-400',
			border: 'border-orange-200 dark:border-orange-800',
			bg: 'bg-orange-50 dark:bg-orange-900/20',
		},
		minor: {
			icon: <AlertTriangle size={20} />,
			label: t('incidents.minorEvent'),
			color: 'text-amber-700 dark:text-amber-400',
			border: 'border-amber-200 dark:border-amber-800',
			bg: 'bg-amber-50 dark:bg-amber-900/20',
		},
		maintenance: {
			icon: <Wrench size={20} />,
			label: t('severity.maintenance'),
			color: 'text-slate-700 dark:text-slate-400',
			border: 'border-slate-200 dark:border-slate-700',
			bg: 'bg-slate-50 dark:bg-slate-800/50',
		},
	};
}

export default function IncidentDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { data: incident, isLoading } = useIncident(id || '');

	function formatRelativeTime(isoString: string): string {
		const date = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMin = Math.floor(diffMs / 60000);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffMin < 1) return t('time.justNow');
		if (diffMin < 60) return t('time.minutesAgo', { n: diffMin });
		if (diffHour < 24) return t('time.hoursAgo', { n: diffHour });
		if (diffDay < 7) return t('time.daysAgo', { n: diffDay });
		return formatDateTime(isoString);
	}

	const severityConfig = buildSeverityConfig(t);

	if (isLoading) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-12 text-center">
				<Loader2 size={32} className="mx-auto animate-spin text-primary-600" />
				<p className="mt-4 text-sm text-muted">
					{t('incidents.loading')}
				</p>
			</div>
		);
	}

	if (!incident) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-12 text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
					<AlertTriangle size={32} className="text-muted" />
				</div>
				<h2 className="text-lg font-semibold text-neutral-900">
					{t('incidents.notFound')}
				</h2>
				<p className="mt-2 text-sm text-muted">
					{t('incidents.notFoundDesc')}
				</p>
				<Link
					to="/incidents"
					className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
				>
					<ArrowLeft size={14} />
					{t('incidents.backToList')}
				</Link>
			</div>
		);
	}

	const cfg = severityConfig[incident.severity] || severityConfig.minor;

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			{/* Back link */}
			<Link
				to="/incidents"
				className="inline-flex items-center gap-1 text-sm text-muted hover:text-neutral-800"
			>
				<ArrowLeft size={16} />
				{t('incidents.backToList')}
			</Link>

			{/* Header */}
			<div className={`mt-6 rounded-xl border p-6 ${cfg.bg} ${cfg.border}`}>
				<div className="flex items-start gap-3">
					<div className={`mt-0.5 ${cfg.color}`}>{cfg.icon}</div>
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
								{cfg.label}
							</span>
							<StatusBadge status={incident.status} />
						</div>
						<h1 className="mt-2 text-xl font-bold text-neutral-900">
							{incident.title}
						</h1>
						<p className="mt-1 text-sm text-neutral-600">
							{incident.description}
						</p>
					</div>
				</div>

				{/* Meta */}
				<div className="mt-5 grid gap-3 sm:grid-cols-3">
					<div className="flex items-center gap-2 text-sm text-neutral-600">
						<Clock size={14} />
						<span>
							{t('incidents.createdAt')}
							{formatDateTime(incident.createdAt)}
						</span>
					</div>
					{incident.resolvedAt && (
						<div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
							<Clock size={14} />
							<span>
								{t('incidents.resolvedLabel')}
								{formatDateTime(incident.resolvedAt)}
							</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-sm text-neutral-600">
						<MessageSquare size={14} />
						<span>
							{(incident.updates || []).length}
							{t('incidents.updateCount')}
						</span>
					</div>
				</div>
			</div>

			{/* Affected Services */}
			<div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-0 p-5 shadow-sm">
				<h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
					<Server size={16} className="text-muted" />
					{t('incidents.affectedServices')}
				</h2>
				<div className="mt-3 flex flex-wrap gap-2">
					{(incident.affectedServices || []).map((sid) => (
						<Link
							key={sid}
							to={`/services/${sid}`}
							className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
						>
							<Server size={12} />
							{t('service.shortName.' + sid)}
						</Link>
					))}
				</div>
			</div>

			{/* Timeline */}
			<div className="mt-6">
				<h2 className="mb-4 text-lg font-bold text-neutral-900">
					{t('incidents.timeline')}
				</h2>
				{(incident.updates || []).length === 0 ? (
					<div className="rounded-lg border border-neutral-200 bg-neutral-0 p-8 text-center">
						<Clock size={24} className="mx-auto text-muted" />
						<p className="mt-2 text-sm text-muted">
							{t('incidents.noUpdates')}
						</p>
					</div>
				) : (
					<div className="relative space-y-4 pl-6">
						<div className="absolute left-2 top-2 bottom-2 w-px bg-neutral-200" />
						{(incident.updates || []).map((update, index) => (
							<div key={update.id} className="relative">
								<div
									className={`absolute -left-4 top-1.5 h-3 w-3 rounded-full border-2 ${
										index === 0
											? 'border-primary-500 bg-primary-500'
											: 'border-neutral-300 bg-neutral-0'
									}`}
								/>
								<div className="rounded-lg border border-neutral-200 bg-neutral-0 p-4 shadow-sm">
									<div className="flex flex-wrap items-center justify-between gap-2">
										<div className="flex items-center gap-2">
											<StatusBadge status={update.status} />
											<span className="text-xs text-muted">
												{formatRelativeTime(update.createdAt)}
											</span>
										</div>
										<span className="text-xs text-muted">
											{formatDateTime(update.createdAt)}
										</span>
									</div>
									<p className="mt-2 text-sm text-neutral-700">
										{update.message}
									</p>
								</div>
							</div>
						))}

						{/* Resolved endpoint */}
						{incident.status === 'resolved' && (
							<div className="relative">
								<div className="absolute -left-4 top-1.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-500" />
								<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
									<div className="flex items-center gap-2">
										<StatusBadge status="resolved" />
										<span className="text-xs text-emerald-600 dark:text-emerald-400">
											{incident.resolvedAt
												? formatDateTime(incident.resolvedAt)
												: t('incidents.resolvedStatus')}
										</span>
									</div>
									<p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
										{t('incidents.resolvedDesc')}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
