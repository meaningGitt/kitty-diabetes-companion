import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DailyLog } from '@/types/glucose';
import { TARGET_RANGE, getTimingLabel, getFeedingTypeLabel } from '@/lib/glucose-utils';
import { Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareDialogProps {
  logs: DailyLog[];
}

export function ShareDialog({ logs }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const generateSummary = () => {
    const recentLogs = logs.slice(0, 7);
    let summary = '🐱 냥이 혈당 다이어리 기록 요약\n\n';
    summary += `📅 기간: 최근 ${recentLogs.length}일\n`;
    summary += `🎯 목표 혈당 범위: ${TARGET_RANGE.low}-${TARGET_RANGE.high} mg/dL\n\n`;

    const allGlucose = recentLogs.flatMap((log) => log.glucose);
    if (allGlucose.length > 0) {
      const values = allGlucose.map((g) => g.value);
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);

      summary += `📊 혈당 통계\n`;
      summary += `• 평균: ${avg} mg/dL\n`;
      summary += `• 최저: ${min} mg/dL\n`;
      summary += `• 최고: ${max} mg/dL\n`;
      summary += `• 측정 횟수: ${allGlucose.length}회\n\n`;
    }

    summary += '📝 최근 기록:\n';
    recentLogs.forEach((log) => {
      summary += `\n[${log.date}]\n`;
      log.glucose.forEach((g) => {
        summary += `• 혈당: ${g.value}mg/dL (${getTimingLabel(g.timing)}) ${g.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}\n`;
      });
      log.insulin.forEach((i) => {
        summary += `• 인슐린: ${i.type} ${i.dose}단위 ${i.administered ? '✓' : '✗'}\n`;
      });
      log.feeding.forEach((f) => {
        summary += `• 식이: ${getFeedingTypeLabel(f.type)} ${f.amount}${f.unit === 'gram' ? 'g' : '스푼'}\n`;
      });
    });

    summary += '\n⚠️ 이 기록은 참고용이며, 수의학적 진단을 대신하지 않습니다.';
    summary += '\n\n냥이 혈당 다이어리에서 생성됨';

    return summary;
  };

  const handleCopy = async () => {
    const summary = generateSummary();
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: '복사 완료',
      description: '기록 요약이 클립보드에 복사되었습니다.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const summary = generateSummary();
    const subject = encodeURIComponent('냥이 혈당 기록 공유');
    const body = encodeURIComponent(summary);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleKakaoShare = () => {
    const summary = generateSummary();
    // For KakaoTalk, we'll use the web share API or copy
    if (navigator.share) {
      navigator.share({
        title: '냥이 혈당 다이어리',
        text: summary,
      });
    } else {
      handleCopy();
      toast({
        title: '텍스트 복사됨',
        description: '카카오톡에 붙여넣기 하세요.',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          공유하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>기록 공유</DialogTitle>
          <DialogDescription>
            주치의 또는 가족에게 혈당 기록을 공유하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일로 공유</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleEmailShare} disabled={!email}>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2" onClick={handleKakaoShare}>
              <MessageCircle className="w-4 h-4" />
              카카오톡
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? '복사됨' : '복사하기'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>미리보기</Label>
            <Textarea
              readOnly
              value={generateSummary()}
              className="h-40 text-xs resize-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
