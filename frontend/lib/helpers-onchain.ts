import clientConfig from '@/lib/env-config-client';

export const getMoveTarget = (pkg: string, fun: string) =>
  `${clientConfig.NEXT_PUBLIC_POLL_PACKAGE_ADDRESS}::${pkg}::${fun}`;
