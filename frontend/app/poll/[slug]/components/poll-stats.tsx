import { PollData } from '@/lib/poll-reads';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PollStats = ({ poll }: { poll: PollData }) => {
  const totalVotes = poll.votes.reduce((acc, curr) => acc + Number(curr), 0);
  return (
    <div className="mb-[90px] grid grid-cols-1 font-mono">
      <div className="mb-4 font-sans text-2xl font-bold">
        <span className="font-bold">Poll Results</span>
      </div>
      <div className="">Total Votes: {totalVotes}</div>
      <div className="">
        Created on:
        {new Date(Number(poll.createdAt)).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div>Status: {poll.ended ? 'Ended' : 'Ongoing'}</div>
      <hr className="my-4 w-[100px]"></hr>
      {totalVotes === 0 && (
        <div
          onClick={() => {
            try {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard');
            } catch (error: unknown) {
              console.warn('could not copy link', error);
            }
          }}
          className="cursor-pointer select-none"
        >
          No votes yet. Click here to copy and share your link!
        </div>
      )}
      {poll.options.length > 0 &&
        poll.options.map((option, index) => (
          <div
            className={cn(
              'flex flex-col gap-1',
              Number(poll.votes[index]) === 0 && 'hidden',
            )}
            key={index}
          >
            <span className="">
              {option}: {poll.votes[index]}{' '}
              <span className="sm:hidden">
                ({(Number(poll.votes[index]) / totalVotes) * 100}%)
              </span>
            </span>
            <div className="relative col-span-5 flex items-center gap-1 max-sm:hidden">
              {Array.from(
                {
                  length: Math.floor(
                    (Number(poll.votes[index]) / totalVotes) * 20,
                  ),
                },
                (_, i) => (
                  <div key={i} className="h-6 w-4 bg-foreground"></div>
                ),
              )}{' '}
              <span className="">
                {(Number(poll.votes[index]) / totalVotes) * 100}%
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PollStats;
