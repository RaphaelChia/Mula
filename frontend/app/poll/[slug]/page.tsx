'use client';

import PollStats from '@/app/poll/[slug]/components/poll-stats';
import { Button } from '@/components/ui/button';
import { useSubmitPollOptionNew } from '@/hooks/poll/useSubmitPollOption';
import { usePollById } from '@/lib/poll-reads';
import { cn } from '@/lib/utils';
import { useAccounts } from '@mysten/dapp-kit';
import { Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const PollOption = ({
  option,
  onClick,
  selected,
}: {
  option: string;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-lg border-2 border-border p-4 text-center text-lg font-semibold transition-transform hover:scale-[102%] hover:border-foreground',
        selected && 'bg-foreground text-background',
      )}
    >
      <span>{option}</span>
    </button>
  );
};

const Page = () => {
  const [selectedOption, setSelectedOption] = useState<Number | null>(null);
  const account = useAccounts()[0];
  const { slug } = useParams();
  const { data, isLoading, isError, error } = usePollById(slug as string);
  const { mutateAsync } = useSubmitPollOptionNew();
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
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      <span className="font-sans text-2xl font-bold">{data?.name}</span>
      <div className="mb-[90px] grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {data?.options.map((option, idx) => (
          <PollOption
            onClick={() => setSelectedOption(idx)}
            selected={selectedOption === idx}
            key={idx}
            option={option}
          />
        ))}
      </div>
      {data.ended ||
        (account && data.creator === account.address && (
          <PollStats poll={data} />
        ))}
      <Button
        className="fixed bottom-0 left-[50%] my-6 w-[80%] -translate-x-1/2 text-lg font-bold"
        size="lg"
        variant="default"
        disabled={selectedOption === null}
        onClick={async () => {
          console.log(selectedOption);
          mutateAsync({
            pollId: data.id,
            option: Number(selectedOption),
          })
            .then(() => {
              toast.success('Poll submitted successfully');
            })
            .catch((error) => {
              toast.error('Failed to submit poll');
              console.error('Transaction error:', error);
            });
        }}
      >
        Submit <Send className="size-4" />
      </Button>
    </div>
  );
};

export default Page;
