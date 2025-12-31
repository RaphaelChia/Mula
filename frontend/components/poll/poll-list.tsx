'use client';

import PollListItem from '@/components/poll/poll-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePolls } from '@/lib/atoms/poll';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface PollListProps {
  debouncedSearch: string;
}

const Polllist = ({ debouncedSearch }: PollListProps) => {
  const { polls } = usePolls();
  // Memoize the filtered polls to prevent unnecessary recalculations
  const filteredPolls = useMemo(() => {
    return polls.filter(
      (poll) => debouncedSearch === '' || poll.includes(debouncedSearch),
    );
  }, [polls, debouncedSearch]);

  return (
    <ScrollArea className="h-[300px] rounded-lg border">
      <div className="flex flex-col font-mono">
        {debouncedSearch !== '' && (
          <Link
            href={`/poll/${debouncedSearch}`}
            className="m-2 flex cursor-pointer items-center gap-2 rounded-sm border bg-secondary p-2 font-sans font-semibold hover:border-foreground"
          >
            <Search className="size-4" /> Search on-chain for poll:{' '}
            {debouncedSearch} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {filteredPolls.map((poll) => (
        <PollListItem key={poll} pollId={poll} />
      ))}
      <div className="p-4 text-center font-sans">- end of list -</div>
    </ScrollArea>
  );
};

export default Polllist;
