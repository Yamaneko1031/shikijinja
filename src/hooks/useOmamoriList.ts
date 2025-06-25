'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { OmamoriBase } from '@/types/omamori';

const fetcher = (url: string) => apiFetch<OmamoriBase[]>(url);

export const useOmamoriList = () => {
  const { data, error, isLoading } = useSWR<OmamoriBase[]>('/api/omamori/master', fetcher);
  const [omamoriList, setOmamoriList] = useState<OmamoriBase[]>([]);
  useEffect(() => {
    if (data) {
      setOmamoriList(data);
    }
  }, [data]);

  return { omamoriList, error, isLoading } as const;
};
