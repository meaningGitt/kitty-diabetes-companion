import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { FeedingRecord } from '@/types/glucose';
import { generateId } from '@/lib/glucose-utils';
import { Utensils } from 'lucide-react';

interface FeedingFormProps {
  onSubmit: (record: FeedingRecord) => void;
}

export function FeedingForm({ onSubmit }: FeedingFormProps) {
  const [type, setType] = useState<'wet' | 'dry' | 'treat' | 'liquid'>('wet');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<'spoon' | 'gram'>('gram');
  const [carbLevel, setCarbLevel] = useState<'high' | 'medium' | 'low'>('medium');

  const numericAmount = parseFloat(amount);
  const isValid = !isNaN(numericAmount) && numericAmount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const record: FeedingRecord = {
      id: generateId(),
      timestamp: new Date(),
      type,
      amount: numericAmount,
      unit,
      carbLevel,
    };

    onSubmit(record);
    setAmount('');
  };

  const typeOptions = [
    { value: 'wet', label: '습식', emoji: '🥫' },
    { value: 'dry', label: '건식', emoji: '🥣' },
    { value: 'treat', label: '츄르', emoji: '🍬' },
    { value: 'liquid', label: '유동식', emoji: '🥛' },
  ];

  const carbOptions = [
    { value: 'low', label: '낮음', color: 'bg-success/20 text-success border-success/30' },
    { value: 'medium', label: '보통', color: 'bg-warning/20 text-warning-foreground border-warning/30' },
    { value: 'high', label: '높음', color: 'bg-destructive/20 text-destructive border-destructive/30' },
  ];

  return (
    <Card className="p-5 glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold">식이 기록</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">사료 종류</Label>
          <div className="grid grid-cols-4 gap-2">
            {typeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={type === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType(option.value as typeof type)}
                className="h-12 flex-col gap-0.5"
              >
                <span className="text-lg">{option.emoji}</span>
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium">
              급여량
            </Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.5"
              placeholder="양"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">단위</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <Button
                type="button"
                variant={unit === 'gram' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUnit('gram')}
              >
                g
              </Button>
              <Button
                type="button"
                variant={unit === 'spoon' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUnit('spoon')}
              >
                스푼
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">탄수화물 수준</Label>
          <div className="grid grid-cols-3 gap-2">
            {carbOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCarbLevel(option.value as typeof carbLevel)}
                className={`h-10 border-2 ${carbLevel === option.value ? option.color : ''}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="success"
          size="lg"
          className="w-full"
          disabled={!isValid}
        >
          식이 기록하기
        </Button>
      </form>
    </Card>
  );
}
