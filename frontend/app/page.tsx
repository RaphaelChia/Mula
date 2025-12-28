import ButtonCreatePoll from '@/components/poll/button-create-poll';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { Search } from 'lucide-react';

export default function Page() {
  return (
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] items-center justify-between">
      <Toaster />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 max-sm:w-[240px] sm:w-xs">
          <Input placeholder="poll ID" className=""></Input>
          <Label className="shrink-0">
            <Search className="size-4" />
          </Label>
        </div>
      </div>
      <ButtonCreatePoll />
    </div>
  );
}
