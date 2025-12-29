import ButtonCreatePoll from '@/components/poll/button-create-poll';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

const MainControlBar = () => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
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
};

export default MainControlBar;
