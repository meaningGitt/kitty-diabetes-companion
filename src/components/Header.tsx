import { CatPaw } from './icons/CatPaw';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CatPaw className="w-8 h-8 text-primary animate-bounce-gentle" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">냥이 혈당 다이어리</h1>
            <p className="text-xs text-muted-foreground">당뇨 고양이를 위한 케어 기록</p>
          </div>
        </div>
      </div>
    </header>
  );
}
