'use client';

import PollListItem from '@/components/poll/poll-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePolls } from '@/lib/atoms/poll';

const Polllist = () => {
  const { polls } = usePolls();
  return (
    <ScrollArea className="h-[300px] rounded-lg border">
      <div className="flex flex-col gap-2 font-mono">
        {polls.map((poll, idx) => (
          <PollListItem key={`poll_${idx}`} pollId={poll} />
        ))}
      </div>
      <div className="p-4 text-center font-sans">- end of list -</div>
    </ScrollArea>
  );
};

export default Polllist;
