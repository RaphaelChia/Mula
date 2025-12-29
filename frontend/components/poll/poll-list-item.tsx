'use client';

import { usePollById } from '@/lib/poll-reads';
import { Calendar, Check, Circle, CircleSlash2, List } from 'lucide-react';

interface PollListItemProps {
  pollId: string;
}

const BadgeInfo = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-fit items-center gap-2 rounded-full border px-2 text-sm text-muted-foreground">
      {children}
    </div>
  );
};

const PollListItem = ({ pollId }: PollListItemProps) => {
  const { data, isLoading, isError, error } = usePollById(pollId);
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Poll not found</div>;
  }
  return (
    <div className="flex cursor-pointer flex-col p-4 select-none hover:bg-muted">
      <div className="flex items-center gap-4">
        <span className="w-0 flex-1 truncate">{data.name}</span>
        <div className="flex shrink-0 items-center gap-2">
          <Calendar className="size-4" />
          <span className="max-sm:hidden">
            {new Date(Number(data.createdAt)).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span className="sm:hidden">
            {Math.floor(
              (Date.now() - Number(data.createdAt)) / (1000 * 60 * 60 * 24),
            )}
            d
          </span>
        </div>
      </div>
      <div className="item-center flex gap-2">
        <BadgeInfo>
          {data.options.length} <List className="size-4" />
        </BadgeInfo>
        <BadgeInfo>
          {data.voters.length} <Check className="size-4" />
        </BadgeInfo>
        <BadgeInfo>
          {data.ended ? 'Ended' : 'Active'}{' '}
          {!data.ended && (
            <Circle className="size-4 rounded-full bg-green-300" />
          )}
          {data.ended && (
            <CircleSlash2 className="size-4 rounded-full bg-red-300" />
          )}
        </BadgeInfo>
      </div>
    </div>
  );
};

export default PollListItem;
