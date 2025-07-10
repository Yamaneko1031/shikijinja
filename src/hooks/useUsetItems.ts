'use client';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { UserItems } from '@/types/user';

const fetcher = (url: string) => apiFetch<UserItems>(url).then((res) => res);

export const useUserItems = (isUserInit: boolean) => {
  const {
    data: userItems,
    isLoading: isLoadingUserItems,
    mutate: mutateUserItems,
  } = useSWR(isUserInit ? '/api/user/items' : null, fetcher, {
    revalidateOnFocus: false,
  });

  return { userItems, isLoadingUserItems, mutateUserItems } as const;
};
