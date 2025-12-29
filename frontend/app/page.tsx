import MainControlBar from '@/components/main-control-bar';
import PollList from '@/components/poll/poll-list';

export default function Page() {
  return (
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold">Create and share your polls.</span>
        <span>Powered by Sui.</span>
      </div>
      <MainControlBar />
      <PollList />
    </div>
  );
}
