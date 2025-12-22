'use client';
import LogoBase from '@/components/logo/logo-base';
import { ConnectButton } from '@mysten/dapp-kit';

const Navbar = () => {
  return (
    <nav className="mx-auto flex w-7xl max-w-[calc(100%-2*var(--pagepx))] items-center justify-between py-4">
      <div className="flex h-[52px] w-full items-center justify-between">
        <LogoBase />
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
