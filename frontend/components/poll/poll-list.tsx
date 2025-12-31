'use client';

import PollListItem from '@/components/poll/poll-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import useDebounce from '@/hooks/usedebounce';
import { usePolls } from '@/lib/atoms/poll';
import { useSearchbar } from '@/lib/atoms/searchbar';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

const Polllist = () => {
  const { polls } = usePolls();
  const { searchbar } = useSearchbar();
  const debouncedSearch = useDebounce(searchbar, 500);
  const filteredPolls = polls.filter(
    (poll) => debouncedSearch === '' || poll.includes(debouncedSearch),
  );
  return (
    <ScrollArea className="h-[300px] rounded-lg border">
      <div className="flex flex-col gap-2 font-mono">
        {debouncedSearch !== '' && (
          <Link
            href={`/poll/${debouncedSearch}`}
            className="m-2 mb-0 flex cursor-pointer items-center gap-2 rounded-sm border bg-secondary p-2 font-sans font-semibold hover:border-foreground"
          >
            <Search className="size-4" /> Search on-chain for poll:{' '}
            {debouncedSearch} <ArrowRight className="size-4" />
          </Link>
        )}
        {filteredPolls.map((poll, idx) => (
          <PollListItem key={`poll_${idx}`} pollId={poll} />
        ))}
      </div>
      <div className="p-4 text-center font-sans">- end of list -</div>
    </ScrollArea>
  );
};

export default Polllist;
