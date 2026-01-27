import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { DailyLog, GlucoseRecord } from '@/types/glucose';
import { TARGET_RANGE } from '@/lib/glucose-utils';
import { Activity } from 'lucide-react';

interface GlucoseChartProps {
  logs: DailyLog[];
  days?: number;
}

export function GlucoseChart({ logs, days = 7 }: GlucoseChartProps) {
  const chartData = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allRecords: (GlucoseRecord & { dateLabel: string })[] = [];

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate >= cutoffDate) {
        log.glucose.forEach((g) => {
          allRecords.push({
            ...g,
            dateLabel: `${logDate.getMonth() + 1}/${logDate.getDate()}`,
          });
        });
      }
    });

    return allRecords
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .map((record) => ({
        time: `${record.dateLabel} ${record.timestamp.getHours()}:${String(record.timestamp.getMinutes()).padStart(2, '0')}`,
        value: record.value,
        timing: record.timing,
      }));
  }, [logs, days]);

  if (chartData.length === 0) {
    return (
      <Card className="p-5 glass-card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">혈당 추이</h2>
        </div>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          <p>아직 기록된 혈당 데이터가 없습니다</p>
        </div>
      </Card>
    );
  }

  const minValue = Math.min(...chartData.map((d) => d.value), TARGET_RANGE.low - 20);
  const maxValue = Math.max(...chartData.map((d) => d.value), TARGET_RANGE.high + 50);

  return (
    <Card className="p-5 glass-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">혈당 추이</h2>
        </div>
        <span className="text-sm text-muted-foreground">최근 {days}일</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minValue, maxValue]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} mg/dL`, '혈당']}
            />
            
            {/* Target range background */}
            <ReferenceArea
              y1={TARGET_RANGE.low}
              y2={TARGET_RANGE.high}
              fill="hsl(var(--success))"
              fillOpacity={0.1}
            />
            
            {/* Target range lines */}
            <ReferenceLine
              y={TARGET_RANGE.low}
              stroke="hsl(var(--success))"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={TARGET_RANGE.high}
              stroke="hsl(var(--success))"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            
            {/* Danger zones */}
            <ReferenceLine
              y={70}
              stroke="hsl(var(--danger-low))"
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
            <ReferenceLine
              y={300}
              stroke="hsl(var(--danger-high))"
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success/30 border border-success" />
          <span>목표 범위 ({TARGET_RANGE.low}-{TARGET_RANGE.high})</span>
        </div>
      </div>
    </Card>
  );
}
