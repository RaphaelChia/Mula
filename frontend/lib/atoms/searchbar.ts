import { useAtom } from 'jotai/react';
import { atom } from 'jotai/vanilla';

export const searchbarAtom = atom<string>('');

export const useSearchbar = () => {
  const [searchbar, setSearchbar] = useAtom(searchbarAtom);
  return {
    searchbar,
    setSearchbar,
  };
};
