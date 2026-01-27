import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GlucoseRecord } from '@/types/glucose';
import { generateId, getGlucoseAlert } from '@/lib/glucose-utils';
import { AlertBanner } from './AlertBanner';
import { Droplet } from 'lucide-react';

interface GlucoseFormProps {
  onSubmit: (record: GlucoseRecord) => void;
  previousValue?: number;
  previousTimestamp?: Date;
}

export function GlucoseForm({ onSubmit, previousValue, previousTimestamp }: GlucoseFormProps) {
  const [value, setValue] = useState('');
  const [timing, setTiming] = useState<'fasting' | 'postprandial' | 'bedtime'>('fasting');
  const [notes, setNotes] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const numericValue = parseInt(value);
  const isValid = !isNaN(numericValue) && numericValue > 0 && numericValue < 1000;

  const alert = isValid ? getGlucoseAlert(
    numericValue,
    previousValue,
    previousTimestamp ? (Date.now() - previousTimestamp.getTime()) / (1000 * 60 * 60) : undefined
  ) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const record: GlucoseRecord = {
      id: generateId(),
      timestamp: new Date(),
      value: numericValue,
      timing,
      notes: notes.trim() || undefined,
    };

    onSubmit(record);
    setValue('');
    setNotes('');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const timingOptions = [
    { value: 'fasting', label: '공복' },
    { value: 'postprandial', label: '식후' },
    { value: 'bedtime', label: '취침 전' },
  ];

  return (
    <Card className="p-5 glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">혈당 기록</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="glucose" className="text-sm font-medium">
            혈당 수치 (mg/dL)
          </Label>
          <Input
            id="glucose"
            type="number"
            inputMode="numeric"
            placeholder="예: 150"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1.5 text-2xl font-bold h-14 text-center"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">측정 시점</Label>
          <div className="grid grid-cols-3 gap-2">
            {timingOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={timing === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTiming(option.value as typeof timing)}
                className="h-10"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium">
            메모 (선택)
          </Label>
          <Textarea
            id="notes"
            placeholder="귀 차가움, 기력 저하 등..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 resize-none"
            rows={2}
          />
        </div>

        {isValid && alert && (
          <AlertBanner alert={alert} />
        )}

        <Button
          type="submit"
          variant="record"
          size="lg"
          className="w-full"
          disabled={!isValid}
        >
          혈당 기록하기
        </Button>
      </form>
    </Card>
  );
}
