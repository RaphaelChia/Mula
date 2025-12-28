import { useAtom } from 'jotai/react';
import { atomWithStorage } from 'jotai/utils';

export const POLLS = atomWithStorage<string[]>('polls', []);

export const usePolls = () => {
  const [polls, setPolls] = useAtom(POLLS);
  return {
    polls,
    setPolls,
  };
};
