import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { InsulinRecord } from '@/types/glucose';
import { generateId } from '@/lib/glucose-utils';
import { Syringe } from 'lucide-react';

interface InsulinFormProps {
  onSubmit: (record: InsulinRecord) => void;
}

export function InsulinForm({ onSubmit }: InsulinFormProps) {
  const [type, setType] = useState('');
  const [dose, setDose] = useState('');
  const [administered, setAdministered] = useState(true);

  const numericDose = parseFloat(dose);
  const isValid = type.trim() !== '' && !isNaN(numericDose) && numericDose > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const record: InsulinRecord = {
      id: generateId(),
      timestamp: new Date(),
      type: type.trim(),
      dose: numericDose,
      administered,
    };

    onSubmit(record);
    setDose('');
  };

  const presetTypes = ['란투스', '프로진크', '베트슐린', '기타'];

  return (
    <Card className="p-5 glass-card">
      <div className="flex items-center gap-2 mb-4">
        <Syringe className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">인슐린 기록</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">인슐린 종류</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {presetTypes.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={type === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
          <Input
            placeholder="또는 직접 입력"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="dose" className="text-sm font-medium">
            용량 (단위)
          </Label>
          <Input
            id="dose"
            type="number"
            inputMode="decimal"
            step="0.25"
            placeholder="예: 1.5"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="mt-1.5 text-xl font-bold h-12 text-center"
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Checkbox
            id="administered"
            checked={administered}
            onCheckedChange={(checked) => setAdministered(checked === true)}
          />
          <Label htmlFor="administered" className="text-sm cursor-pointer">
            투여 완료
          </Label>
        </div>

        <Button
          type="submit"
          variant="record"
          size="lg"
          className="w-full"
          disabled={!isValid}
        >
          인슐린 기록하기
        </Button>
      </form>
    </Card>
  );
}
