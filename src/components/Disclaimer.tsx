import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p>
        이 앱은 혈당 기록을 돕기 위한 도구이며, 수의학적 진단이나 치료를 대신하지 않습니다. 
        모든 의료적 결정은 반드시 수의사와 상담하세요.
      </p>
    </div>
  );
}
