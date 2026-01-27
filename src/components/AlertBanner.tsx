import { GlucoseAlert } from '@/types/glucose';
import { getAlertBgColor, getAlertColor } from '@/lib/glucose-utils';
import { cn } from '@/lib/utils';
import { AlertTriangle, Heart, TrendingDown, TrendingUp } from 'lucide-react';

interface AlertBannerProps {
  alert: GlucoseAlert;
  className?: string;
}

export function AlertBanner({ alert, className }: AlertBannerProps) {
  const getIcon = () => {
    switch (alert.type) {
      case 'low':
        return <TrendingDown className="w-5 h-5" />;
      case 'high':
        return <TrendingUp className="w-5 h-5" />;
      case 'rapid-drop':
        return <TrendingDown className="w-5 h-5" />;
      case 'rapid-rise':
        return <TrendingUp className="w-5 h-5" />;
      case 'normal':
        return <Heart className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 animate-fade-in',
        getAlertBgColor(alert.level),
        className
      )}
    >
      <div className={cn('flex items-start gap-3', getAlertColor(alert.level))}>
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <p className="font-semibold">{alert.message}</p>
          {alert.recommendation && (
            <p className="text-sm mt-1 opacity-90">{alert.recommendation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
