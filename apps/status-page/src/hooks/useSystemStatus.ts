import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
	fetchGatewayHealth,
	fetchIncidents,
	fetchIncident,
	fetchMaintenances,
	fetchMaintenance,
	fetchLatencyMetrics,
	fetchUptimeMetrics,
	fetchOverview,
	fetchServiceCatalog,
	fetchRssXml,
	buildServiceStatuses,
} from '@/lib/api';

/**
 * 原始 gateway /ready 健康检查（checks: {svc}:{port} / grpc:{svc}）。
 * 服务清单派生见 useServiceStatuses（catalog × health）。
 */
export function useSystemStatus() {
	return useQuery({
		queryKey: ['system-status'],
		queryFn: fetchGatewayHealth,
		staleTime: 15000,
	});
}

/**
 * 服务状态列表 — 由 catalog（权威服务清单 25）+ /ready（实时状态）派生。
 * 单一事实来源，前端不再维护硬编码服务清单。
 */
export function useServiceStatuses() {
	const catalog = useServiceCatalog();
	const health = useSystemStatus();
	const data = useMemo(
		() => buildServiceStatuses(catalog.data ?? null, health.data ?? null),
		[catalog.data, health.data],
	);
	return {
		data,
		isLoading: catalog.isLoading || health.isLoading,
		isFetching: health.isFetching,
		refetch: health.refetch,
		isError: catalog.isError || health.isError,
	};
}

export function useOverview() {
	return useQuery({
		queryKey: ['overview'],
		queryFn: fetchOverview,
		staleTime: 15000,
	});
}

export function useIncidents() {
	return useQuery({
		queryKey: ['incidents'],
		queryFn: fetchIncidents,
		staleTime: 60000,
	});
}

export function useIncident(id: string) {
	return useQuery({
		queryKey: ['incident', id],
		queryFn: () => fetchIncident(id),
		staleTime: 60000,
		enabled: !!id,
	});
}

export function useMaintenances() {
	return useQuery({
		queryKey: ['maintenances'],
		queryFn: fetchMaintenances,
		staleTime: 60000,
	});
}

export function useMaintenance(id: string) {
	return useQuery({
		queryKey: ['maintenance', id],
		queryFn: () => fetchMaintenance(id),
		staleTime: 60000,
		enabled: !!id,
	});
}

export function useLatencyMetrics(serviceId: string, rangeVal = '24h') {
	return useQuery({
		queryKey: ['latency-metrics', serviceId, rangeVal],
		queryFn: () => fetchLatencyMetrics(serviceId, rangeVal),
		staleTime: 60000,
		enabled: !!serviceId,
	});
}

export function useUptimeMetrics(serviceId: string, rangeVal = '24h') {
	return useQuery({
		queryKey: ['uptime-metrics', serviceId, rangeVal],
		queryFn: () => fetchUptimeMetrics(serviceId, rangeVal),
		staleTime: 60000,
		enabled: !!serviceId,
	});
}

export function useServiceCatalog() {
	return useQuery({
		queryKey: ['service-catalog'],
		queryFn: fetchServiceCatalog,
		staleTime: 5 * 60 * 1000,
	});
}

export function useRssXml() {
	return useQuery({
		queryKey: ['rss-feed'],
		queryFn: fetchRssXml,
		staleTime: 5 * 60 * 1000,
	});
}
