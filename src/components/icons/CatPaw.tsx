import { cn } from '@/lib/utils';

interface CatPawProps {
  className?: string;
}

export function CatPaw({ className }: CatPawProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('w-6 h-6', className)}
    >
      <ellipse cx="12" cy="14" rx="5" ry="6" />
      <circle cx="6" cy="8" r="3" />
      <circle cx="18" cy="8" r="3" />
      <circle cx="4" cy="13" r="2.5" />
      <circle cx="20" cy="13" r="2.5" />
    </svg>
  );
}
