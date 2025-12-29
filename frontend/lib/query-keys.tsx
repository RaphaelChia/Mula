export const POLL_QUERY_KEYS = {
  base: ['poll'],
  all: () => [...POLL_QUERY_KEYS.base],
  byId: (pollId: string) => [...POLL_QUERY_KEYS.base, pollId],
};
