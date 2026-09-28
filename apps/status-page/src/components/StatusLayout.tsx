import { Outlet } from 'react-router';
import StatusHeader from './StatusHeader';
import Footer from './Footer';
import { useSystemStatus, useOverview } from '@/hooks/useSystemStatus';
import { normalizeOverallStatus } from '@/lib/api';

export default function StatusLayout() {
	const { data } = useSystemStatus();
	const { data: overview } = useOverview();
	// /ready 不可用（SPA fallback / 代理异常）时回退 overview 的 overall_status，
	// 避免误报"所有系统运行正常"。useSystemStatus 返回 raw gateway health（data.status）。
	// 两个来源词表不同（见 normalizeOverallStatus），必须归一化后再进 StatusHeader 色板表。
	const overallStatus = normalizeOverallStatus(data?.status ?? overview?.overallStatus) ?? 'healthy';

	return (
		<div className="flex min-h-screen flex-col">
			<StatusHeader overallStatus={overallStatus} />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
