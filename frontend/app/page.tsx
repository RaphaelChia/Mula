import MainControlBar from '@/components/main-control-bar';
import PollList from '@/components/poll/poll-list';

export default function Page() {
  return (
    <div className="mx-auto my-(--pagepy) flex w-7xl max-w-[calc(100%-2*var(--pagepx))] flex-col gap-4">
      <MainControlBar />
      <PollList />
    </div>
  );
}
