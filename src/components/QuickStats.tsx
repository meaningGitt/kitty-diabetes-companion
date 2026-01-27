import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { DailyLog } from '@/types/glucose';
import { TARGET_RANGE } from '@/lib/glucose-utils';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface QuickStatsProps {
  logs: DailyLog[];
}

export function QuickStats({ logs }: QuickStatsProps) {
  const stats = useMemo(() => {
    const allGlucose = logs.flatMap((log) => log.glucose);
    
    if (allGlucose.length === 0) {
      return null;
    }

    const values = allGlucose.map((g) => g.value);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const latest = allGlucose.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
    
    const inRange = values.filter(
      (v) => v >= TARGET_RANGE.low && v <= TARGET_RANGE.high
    ).length;
    const inRangePercent = Math.round((inRange / values.length) * 100);

    return {
      latest: latest.value,
      average: avg,
      inRangePercent,
      total: values.length,
    };
  }, [logs]);

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: '최근 혈당',
      value: `${stats.latest}`,
      unit: 'mg/dL',
      icon: Activity,
      color: 'text-primary',
    },
    {
      label: '평균',
      value: `${stats.average}`,
      unit: 'mg/dL',
      icon: TrendingUp,
      color: 'text-accent',
    },
    {
      label: '목표 달성',
      value: `${stats.inRangePercent}`,
      unit: '%',
      icon: Target,
      color: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {statCards.map((stat) => (
        <Card key={stat.label} className="p-3 glass-card text-center">
          <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
          <div className="text-xl font-bold">
            {stat.value}
            <span className="text-xs font-normal text-muted-foreground ml-0.5">
              {stat.unit}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}
