'use client';

import PollStats from '@/app/poll/[slug]/components/poll-stats';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEndPoll } from '@/hooks/poll/useEndPoll';
import { useSubmitPollOptionNew } from '@/hooks/poll/useSubmitPollOption';
import { usePolls } from '@/lib/atoms/poll';
import { usePollById } from '@/lib/poll-reads';
import { POLL_QUERY_KEYS } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const PollOption = ({
  option,
  onClick,
  selected,
  disabled,
}: {
  option: string;
  onClick: () => void;
  selected: boolean;
  disabled: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-lg border-2 border-border p-4 text-center text-lg font-semibold',
        !disabled &&
          'transition-transform hover:scale-[102%] hover:border-foreground',
        selected && 'bg-foreground text-background',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span>{option}</span>
    </button>
  );
};

const EndPollButton = ({
  disabled,
  pollId,
}: {
  disabled: boolean;
  pollId: string;
}) => {
  const { mutateAsync } = useEndPoll();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="border border-border"
          size="lg"
          variant="ghost"
          disabled={disabled}
        >
          End
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End poll</DialogTitle>
          <DialogDescription>
            Are you sure you want to end this poll? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={() => mutateAsync({ pollId })}>
            End
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Page = () => {
  const [selectedOption, setSelectedOption] = useState<Number | null>(null);
  const { setPolls } = usePolls();
  const account = useCurrentAccount();
  const { slug } = useParams();
  const { data, isLoading, isError, error } = usePollById(slug as string);
  const { mutateAsync } = useSubmitPollOptionNew();
  const queryClient = useQueryClient();
  const onsubmit = useCallback(() => {
    {
      if (!data) return;
      if (!account || !account.address) {
        toast.warning('Please connect your wallet before voting');
        return;
      }
      mutateAsync({
        pollId: data.id,
        option: Number(selectedOption),
      })
        .then(() => {
          toast.success('Poll submitted successfully');
          setTimeout(() => {
            queryClient.refetchQueries({
              queryKey: POLL_QUERY_KEYS.byId(data.id),
            });
          }, 500);
        })
        .catch((error) => {
          toast.error('Failed to submit poll');
          console.error('Transaction error:', error);
        });
    }
  }, [mutateAsync, selectedOption, data, account]);

  useEffect(() => {
    if (data && !data.ended) {
      setPolls((prev) => {
        if (prev.includes(data.id)) {
          return prev;
        }
        return [...prev, data.id];
      });
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>Poll not found</div>;
  }
  return (
    <div className="relative mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      {data.ended && (
        <span className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-destructive opacity-20">
          Poll has Ended
        </span>
      )}
      <span className="font-sans text-2xl font-bold">{data?.name} </span>
      <div className="mb-[90px] grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {data?.options.map((option, idx) => (
          <PollOption
            disabled={
              data.ended || data.voters.includes(account?.address ?? '')
            }
            onClick={() => setSelectedOption(idx)}
            selected={selectedOption === idx}
            key={idx}
            option={option}
          />
        ))}
      </div>
      {(data.ended || (account && data.creator === account.address)) && (
        <PollStats poll={data} />
      )}
      <div className="fixed bottom-0 my-6 flex gap-2 text-lg font-bold sm:left-[50%] sm:-translate-x-1/2">
        {data.creator === account?.address && (
          <EndPollButton disabled={data.ended} pollId={data.id} />
        )}
        <Button
          className=""
          size="lg"
          variant="default"
          disabled={
            selectedOption === null ||
            data.ended ||
            data.voters.includes(account?.address ?? '')
          }
          onClick={onsubmit}
        >
          Submit <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
