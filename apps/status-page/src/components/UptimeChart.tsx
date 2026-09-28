import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { useTheme } from '@autional-cn/ui';

interface UptimeData {
	time: string;
	uptime: number;
	status: 'healthy' | 'degraded' | 'unhealthy';
}

interface UptimeChartProps {
	data: UptimeData[];
	tooltipLabel?: string;
}

const statusColors: Record<string, string> = {
	healthy: 'var(--color-success)',
	degraded: 'var(--color-warning)',
	unhealthy: 'var(--color-danger)',
};

const lightColors = { grid: '#e5e5e5', tick: '#737373', tooltipBorder: '#e5e5e5' };
const darkColors = { grid: '#404040', tick: '#a3a3a3', tooltipBorder: '#404040' };

export function UptimeChart({ data, tooltipLabel }: UptimeChartProps) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const c = isDark ? darkColors : lightColors;
	return (
		<div style={{ width: '100%', height: 260 }}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
					<XAxis
						dataKey="time"
						tick={{ fontSize: 11, fill: c.tick }}
						axisLine={false}
						tickLine={false}
						interval={3}
					/>
					<YAxis
						domain={[0, 100]}
						tick={{ fontSize: 11, fill: c.tick }}
						axisLine={false}
						tickLine={false}
						tickFormatter={(v) => `${v}%`}
					/>
					<Tooltip
						formatter={(value) => [`${value}%`, tooltipLabel || 'Uptime']}
						contentStyle={{
							borderRadius: '8px',
							border: '1px solid ' + c.tooltipBorder,
							fontSize: '12px',
						}}
					/>
					<Bar dataKey="uptime" radius={[4, 4, 0, 0]} maxBarSize={24}>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
