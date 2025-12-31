'use client';

import MainControlBar from '@/components/main-control-bar';
import PollList from '@/components/poll/poll-list';
import { useCallback, useState } from 'react';

export default function Page() {
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleDebouncedSearchChange = useCallback((value: string) => {
    setDebouncedSearch(value);
  }, []);

  return (
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold">Create and share your polls.</span>
        <span>Powered by Sui.</span>
      </div>
      <MainControlBar onDebouncedSearchChange={handleDebouncedSearchChange} />
      <PollList debouncedSearch={debouncedSearch} />
    </div>
  );
}
