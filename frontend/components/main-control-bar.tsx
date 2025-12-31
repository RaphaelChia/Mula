'use client';
import ButtonCreatePoll from '@/components/poll/button-create-poll';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchbar } from '@/lib/atoms/searchbar';
import { Search, X } from 'lucide-react';

const MainControlBar = () => {
  const { searchbar, setSearchbar } = useSearchbar();
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 max-sm:w-[240px] sm:w-xs">
          <Input
            placeholder="poll ID"
            className=""
            value={searchbar}
            onChange={(e) => setSearchbar(e.target.value)}
          ></Input>
          <Label className="shrink-0">
            {searchbar === '' && <Search className="size-4" />}
            {searchbar !== '' && (
              <X
                className="size-4 cursor-pointer"
                onClick={() => setSearchbar('')}
              />
            )}
          </Label>
        </div>
      </div>
      <ButtonCreatePoll />
    </div>
  );
};

export default MainControlBar;
