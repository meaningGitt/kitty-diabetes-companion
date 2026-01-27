import { GlucoseRecord, GlucoseAlert, AlertLevel } from '@/types/glucose';

export const TARGET_RANGE = {
  low: 90,
  high: 200,
};

export const ALERT_THRESHOLDS = {
  hypoglycemia: 70,
  hyperglycemia: 300,
  rapidChange: 50, // mg/dL per hour
};

export function getGlucoseAlert(value: number, previousValue?: number, hoursDiff?: number): GlucoseAlert {
  // Check for hypoglycemia
  if (value < ALERT_THRESHOLDS.hypoglycemia) {
    return {
      level: 'danger',
      type: 'low',
      message: '⚠️ 저혈당 위험!',
      recommendation: '즉시 간식을 급여하고 30분 후 재측정을 권장합니다.',
    };
  }

  // Check for hyperglycemia
  if (value > ALERT_THRESHOLDS.hyperglycemia) {
    return {
      level: 'danger',
      type: 'high',
      message: '⚠️ 고혈당 주의!',
      recommendation: '수의사 상담을 고려하세요. 충분한 수분 섭취를 확인해주세요.',
    };
  }

  // Check for rapid changes
  if (previousValue && hoursDiff && hoursDiff > 0) {
    const changeRate = Math.abs(value - previousValue) / hoursDiff;
    
    if (changeRate > ALERT_THRESHOLDS.rapidChange) {
      if (value < previousValue) {
        return {
          level: 'warning',
          type: 'rapid-drop',
          message: '📉 혈당이 급격히 하강하고 있습니다.',
          recommendation: '2시간 후 재측정을 권장합니다. 지금 간식을 고려해보세요.',
        };
      } else {
        return {
          level: 'warning',
          type: 'rapid-rise',
          message: '📈 혈당이 급격히 상승하고 있습니다.',
          recommendation: '2시간 후 재측정을 권장합니다.',
        };
      }
    }
  }

  // Check if within target range
  if (value >= TARGET_RANGE.low && value <= TARGET_RANGE.high) {
    return {
      level: 'normal',
      type: 'normal',
      message: '✨ 혈당이 목표 범위 내에 있습니다.',
    };
  }

  // Slightly outside range but not dangerous
  if (value < TARGET_RANGE.low) {
    return {
      level: 'warning',
      type: 'low',
      message: '혈당이 목표 범위보다 낮습니다.',
      recommendation: '간식 급여를 고려해보세요.',
    };
  }

  return {
    level: 'warning',
    type: 'high',
    message: '혈당이 목표 범위보다 높습니다.',
    recommendation: '다음 측정 시 확인이 필요합니다.',
  };
}

export function getAlertColor(level: AlertLevel): string {
  switch (level) {
    case 'danger':
      return 'text-danger-high';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-success';
  }
}

export function getAlertBgColor(level: AlertLevel): string {
  switch (level) {
    case 'danger':
      return 'bg-danger-high/10 border-danger-high/30';
    case 'warning':
      return 'bg-warning/10 border-warning/30';
    default:
      return 'bg-success/10 border-success/30';
  }
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

export function getTimingLabel(timing: string): string {
  const labels: Record<string, string> = {
    fasting: '공복',
    postprandial: '식후',
    bedtime: '취침 전',
  };
  return labels[timing] || timing;
}

export function getFeedingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    wet: '습식',
    dry: '건식',
    treat: '츄르',
    liquid: '유동식',
  };
  return labels[type] || type;
}

export function getCarbLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    high: '탄수화물 높음',
    medium: '탄수화물 보통',
    low: '탄수화물 낮음',
  };
  return labels[level] || level;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
