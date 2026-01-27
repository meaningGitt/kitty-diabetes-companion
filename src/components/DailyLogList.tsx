import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyLog } from '@/types/glucose';
import {
  formatDateOnly,
  getTimingLabel,
  getFeedingTypeLabel,
  getCarbLevelLabel,
} from '@/lib/glucose-utils';
import { Droplet, Utensils, Syringe, Trash2, Calendar } from 'lucide-react';

interface DailyLogListProps {
  logs: DailyLog[];
  onDelete: (type: 'glucose' | 'feeding' | 'insulin', id: string) => void;
}

export function DailyLogList({ logs, onDelete }: DailyLogListProps) {
  if (logs.length === 0) {
    return (
      <Card className="p-6 glass-card text-center">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">아직 기록이 없습니다</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          위의 폼을 사용해 첫 기록을 시작하세요
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.date} className="p-4 glass-card animate-fade-in">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">
            {formatDateOnly(new Date(log.date))}
          </h3>

          <div className="space-y-2">
            {/* Glucose records */}
            {log.glucose.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Droplet className="w-4 h-4 text-primary" />
                  <div>
                    <span className="font-bold text-lg">{g.value}</span>
                    <span className="text-sm text-muted-foreground ml-1">mg/dL</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {getTimingLabel(g.timing)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {g.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete('glucose', g.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Feeding records */}
            {log.feeding.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Utensils className="w-4 h-4 text-accent" />
                  <div>
                    <span className="font-medium">{getFeedingTypeLabel(f.type)}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {f.amount}{f.unit === 'gram' ? 'g' : '스푼'}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({getCarbLevelLabel(f.carbLevel)})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {f.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete('feeding', f.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Insulin records */}
            {log.insulin.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Syringe className="w-4 h-4 text-primary" />
                  <div>
                    <span className="font-medium">{i.type}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {i.dose}단위
                    </span>
                    {i.administered && (
                      <span className="text-xs text-success ml-2">✓ 투여완료</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {i.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete('insulin', i.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
