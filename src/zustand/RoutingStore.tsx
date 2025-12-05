import { create } from "zustand";
import { IRoute } from "@/stellar/interfaces/IRoute";
import { Stellar } from "@/stellar";

type RoutingStore = {
  Routes: Map<string, IRoute>;
  setRoutes(routes: Record<string, string>): void;
  addRoute(type: string, url: string): void;
  removeRoute(type: string): void;
  initRouting: (types: string[]) => Promise<IRoute[]>;
};

const parseUrl = (url: string) => {
  try {
    const u = new URL(url);
    return { host: u.origin, path: u.pathname };
  } catch {
    return { host: "", path: url };
  }
};

type StoredRoute = {
  type: string;
  route: IRoute;
};

export const useRoutingStore = create<RoutingStore>((set, get) => {
  const stored = Stellar.Storage.get<StoredRoute[]>("routing.store") || [];
  const map = new Map(
    Array.isArray(stored) ? stored.map((s) => [s.type, s.route]) : []
  );

  return {
    Routes: map,
    setRoutes: (routes) => {
      const arr = Object.entries(routes).map(([type, url]) => ({
        url,
        parsed: parseUrl(url),
      }));
      const m = new Map(
        Object.entries(routes).map(([type, url]) => [
          type,
          { url, parsed: parseUrl(url) },
        ])
      );
      const toStore = Array.from(m.entries()).map(([type, route]) => ({
        type,
        route,
      }));
      Stellar.Storage.set("routing.store", toStore);
      set({ Routes: m });
    },
    addRoute: (type, url) =>
      set((state) => {
        const r: IRoute = { url, parsed: parseUrl(url) };
        const m = new Map(state.Routes);
        m.set(type, r);
        const toStore = Array.from(m.entries()).map(([type, route]) => ({
          type,
          route,
        }));
        Stellar.Storage.set("routing.store", toStore);
        return { Routes: m };
      }),
    removeRoute: (type) =>
      set((state) => {
        const m = new Map(state.Routes);
        m.delete(type);
        const toStore = Array.from(m.entries()).map(([type, route]) => ({
          type,
          route,
        }));
        Stellar.Storage.set("routing.store", toStore);
        return { Routes: m };
      }),
    initRouting: async (types) => {
      const routes: IRoute[] = [];
      for (const type of types) {
        const res = await Stellar.Requests.get<{ url: string }>(
          `https://prod-api-v1.stellarfn.dev/stellar/launcher/v1/routing?type=${encodeURIComponent(
            type
          )}`
        );
        if (!res.ok || !res.data?.url) continue;
        routes.push({ url: res.data.url, parsed: parseUrl(res.data.url) });
      }
      if (!routes.length) return Array.from(get().Routes.values());
      const m = new Map(types.map((t, i) => [t, routes[i]]));
      const toStore = Array.from(m.entries()).map(([type, route]) => ({
        type,
        route,
      }));
      set({ Routes: m });
      Stellar.Storage.set("routing.store", toStore);
      return routes;
    },
  };
});
