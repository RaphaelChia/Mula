'use client';
import ButtonCreatePoll from '@/components/poll/button-create-poll';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/hooks/usedebounce';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MainControlBarProps {
  onDebouncedSearchChange: (value: string) => void;
}

const MainControlBar = ({ onDebouncedSearchChange }: MainControlBarProps) => {
  const [searchbar, setSearchbar] = useState('');
  const debouncedSearch = useDebounce(searchbar, 500);
  const router = useRouter();

  // Notify parent only when debounced value changes
  useEffect(() => {
    onDebouncedSearchChange(debouncedSearch);
  }, [debouncedSearch, onDebouncedSearchChange]);
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 max-sm:w-[240px] sm:w-xs">
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/poll/${searchbar}`);
              }
              if (e.key === 'Escape') {
                setSearchbar('');
              }
            }}
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
