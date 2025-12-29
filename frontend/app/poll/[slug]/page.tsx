'use client';

import { Button } from '@/components/ui/button';
import { usePollById } from '@/lib/poll-reads';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { slug } = useParams();
  const { data } = usePollById(slug as string);
  return (
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      <span className="font-sans text-2xl font-bold">{data?.name}</span>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {data?.options.map((option) => (
          <PollOption
            onClick={() => setSelectedOption(option)}
            selected={selectedOption === option}
            key={option}
            option={option}
          />
        ))}
      </div>
      <Button
        className="mt-8 text-lg font-bold"
        size="lg"
        variant="default"
        disabled={!selectedOption}
      >
        Submit <Send className="size-4" />
      </Button>
    </div>
  );
};

export default Page;
