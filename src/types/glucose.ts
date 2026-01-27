export interface GlucoseRecord {
  id: string;
  timestamp: Date;
  value: number;
  timing: 'fasting' | 'postprandial' | 'bedtime';
  notes?: string;
}

export interface FeedingRecord {
  id: string;
  timestamp: Date;
  type: 'wet' | 'dry' | 'treat' | 'liquid';
  amount: number;
  unit: 'spoon' | 'gram';
  carbLevel: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface InsulinRecord {
  id: string;
  timestamp: Date;
  type: string;
  dose: number;
  administered: boolean;
  notes?: string;
}

export interface DailyLog {
  date: string;
  glucose: GlucoseRecord[];
  feeding: FeedingRecord[];
  insulin: InsulinRecord[];
}

export type AlertLevel = 'normal' | 'warning' | 'danger';

export interface GlucoseAlert {
  level: AlertLevel;
  type: 'low' | 'high' | 'rapid-drop' | 'rapid-rise' | 'normal';
  message: string;
  recommendation?: string;
}
