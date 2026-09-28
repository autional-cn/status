import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@autional-cn/ui';

interface LatencyData {
	time: string;
	latency: number;
	status: 'healthy' | 'degraded' | 'unhealthy';
}

interface LatencyChartProps {
	data: LatencyData[];
}

const lightColors = { grid: '#e5e5e5', tick: '#737373', tooltipBorder: '#e5e5e5' };
const darkColors = { grid: '#404040', tick: '#a3a3a3', tooltipBorder: '#404040' };

export default function LatencyChart({ data }: LatencyChartProps) {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const c = isDark ? darkColors : lightColors;
	const maxLatency = Math.max(...data.map((d) => d.latency), 100);
	const threshold = maxLatency > 500 ? 500 : 200;

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
				<XAxis
					dataKey="time"
					tick={{ fontSize: 11, fill: c.tick }}
					axisLine={false}
					tickLine={false}
					interval={Math.floor(data.length / 6)}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: c.tick }}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) => `${v}ms`}
				/>
				<Tooltip
					formatter={(value) => [`${value}ms`, t('service.latencyP95')]}
					contentStyle={{
						borderRadius: '8px',
						border: '1px solid ' + c.tooltipBorder,
						fontSize: '12px',
					}}
				/>
				<ReferenceLine
					y={threshold}
					stroke="var(--color-warning)"
					strokeDasharray="4 4"
					label={{
						value: t('service.latencyThreshold'),
						position: 'right',
						fontSize: 10,
						fill: 'var(--color-warning)',
					}}
				/>
				<Line
					type="monotone"
					dataKey="latency"
					stroke="var(--color-chart-1)"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4, fill: 'var(--color-chart-1)' }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
