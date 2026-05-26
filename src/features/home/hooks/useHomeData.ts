import { useEffect, useState } from "react";
import { getHomeData } from "../api/homeApi";
import type { HomeResponse } from "../types/home";

export function useHomeData() {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const result = await getHomeData();
        if (mounted) setData(result);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading };
}