'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePolls } from '@/lib/atoms/poll';
import { usePollById } from '@/lib/poll/poll-reads';
import { cn } from '@/lib/utils';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  Check,
  Circle,
  CircleSlash2,
  Clock,
  Crown,
  List,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface PollListItemProps {
  pollId: string;
}

const BadgeInfo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex w-fit items-center gap-2 rounded-full border px-2 text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
};

const RemovePollButton = ({ pollId }: { pollId: string }) => {
  const { setPolls } = usePolls();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <X
          onClick={() => {
            setPolls((prev) => prev.filter((p) => p !== pollId));
          }}
          className="size-full cursor-pointer"
        ></X>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remove from list</p>
      </TooltipContent>
    </Tooltip>
  );
};

const PollListItem = ({ pollId }: PollListItemProps) => {
  const account = useCurrentAccount();

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
    <div className="group/poll-list-item flex">
      <div className="flex w-0 items-center justify-center bg-destructive/30 transition-all group-hover/poll-list-item:w-10">
        <RemovePollButton pollId={pollId} />
      </div>
      <Link href={`/poll/${pollId}`} className="w-full bg-background">
        <div className="flex cursor-pointer flex-col p-4 select-none hover:bg-muted">
          <div className="flex items-center gap-4">
            <div className="flex w-full items-center gap-1.5">
              {account && data.creator === account.address && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Crown className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You are the creator of this poll</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <span className="w-0 flex-1 truncate">{data.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Clock className="size-4" />
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
      </Link>
    </div>
  );
};

export default PollListItem;
