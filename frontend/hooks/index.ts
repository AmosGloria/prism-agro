"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Order, OrderStatus } from "@/types";

// ─── Generic fetch hook ───────────────────────────────────────────────────────
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result as T);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

// ─── Order filter hook ────────────────────────────────────────────────────────
export function useOrderFilter(
  orders: Order[] | null,
  status?: OrderStatus | OrderStatus[],
) {
  if (!orders) return [];
  if (!status) return orders;
  const statuses = Array.isArray(status) ? status : [status];
  return orders.filter((o) => statuses.includes(o.status));
}

// ─── Current user hook ────────────────────────────────────────────────────────
export function useUser() {
  const [user, setUser] = useState<{
    name: string;
    role: string;
    walletBalance: number;
  } | null>(null);

  useEffect(() => {
    // Replace with real auth call
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    } else {
      // Mock for dev
      setUser({ name: "Chukwuemeka Obi", role: "buyer", walletBalance: 45000 });
    }
  }, []);

  return user;
}

// ─── Freshness calculator ─────────────────────────────────────────────────────
export function useFreshness(harvestTime: string, initialFreshness: number) {
  const [freshness, setFreshness] = useState(initialFreshness);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const hoursSinceHarvest =
        (Date.now() - new Date(harvestTime).getTime()) / 3_600_000;
      // Decay: ~2% per hour, floored at 0
      const calculated = Math.max(0, Math.round(100 - hoursSinceHarvest * 2));
      setFreshness(calculated);
    };

    update();
    intervalRef.current = setInterval(update, 60_000); // update every minute
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [harvestTime]);

  return freshness;
}

// ─── Time ago ────────────────────────────────────────────────────────────────
export function useTimeAgo(timestamp: string) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - new Date(timestamp).getTime();
      const mins = Math.floor(diff / 60_000);
      const hours = Math.floor(diff / 3_600_000);
      const days = Math.floor(diff / 86_400_000);

      if (mins < 1) setLabel("Just now");
      else if (mins < 60) setLabel(`${mins}m ago`);
      else if (hours < 24) setLabel(`${hours}h ${mins % 60}m ago`);
      else setLabel(`${days}d ago`);
    };

    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, [timestamp]);

  return label;
}

// ─── URL-driven search params ─────────────────────────────────────────────────
export function useSearchParams() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    setParams(obj);
  }, []);

  const updateParam = useCallback((key: string, value: string) => {
    const sp = new URLSearchParams(window.location.search);
    if (value) sp.set(key, value);
    else sp.delete(key);
    const newUrl = `${window.location.pathname}?${sp.toString()}`;
    window.history.pushState({}, "", newUrl);
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { params, updateParam };
}
