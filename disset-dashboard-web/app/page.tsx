"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const peso = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n ?? 0);

type Filters = {
  year?: string;
  property?: string;
  advisor?: string;
  category?: string;
  subcategory?: string;
  type?: string;
};
const qs = (f: Filters) =>
  new URLSearchParams(Object.entries(f).filter(([, v]) => v && v !== "") as any).toString();

export default function Home() {
  const [filters, setFilters] = useState<Filters>({});

  // Opciones para selects
  const { data: opts } = useSWR("/api/filtros", fetcher);

  const query = useMemo(() => (qs(filters) ? `?${qs(filters)}` : ""), [filters]);

  // Datos (con auto-refresh cada 60s)
  const { data: kpis } = useSWR(`/api/kpis${query}`, fetcher, { refreshInterval: 60000 });
  const { data: ie } = useSWR(`/api/ingresos-egresos${query}`, fetcher, { refreshInterval: 60000 });
  const { data: asesores } = useSWR(`/api/honorarios-asesor${query}`, fetcher, { refreshInterval: 60000 });
  const { data: egresosPie } = useSWR(`/api/egresos-por-categoria${query}`, fetcher, { refreshInterval: 60000 });
  const { data: portales } = useSWR(`/api/portales-mensual${query}`, fetcher, { refreshInterval: 60000 });

  const set = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v || undefined }));

  return (
    <main className="p-6 grid gap-6">
      {/* FILTROS */}
      <section className="rounded-2xl bg-white shadow p-4 grid gap-3 md:grid-cols-6">
        {/* Año */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Año</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.year || ""}
            onChange={(e) => set("year", e.target.value)}
          >
            <option value="">Todos</option>
            {(opts?.years || []).map((y: number) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>

        {/* Propiedad */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Propiedad</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.property || ""}
            onChange={(e) => set("property", e.target.value)}
          >
            <option value="">Todas</option>
            {(opts?.properties || []).map((v: string) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Asesor */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Asesor</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.advisor || ""}
            onChange={(e) => set("advisor", e.target.value)}
          >
            <option value="">Todos</option>
            {(opts?.advisors || []).map((v: string) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Categoría</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.category || ""}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">Todas</option>
            {(opts?.categories || []).map((v: string) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Subcategoría */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Subcategoría</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.subcategory || ""}
            onChange={(e) => set("subcategory", e.target.value)}
          >
            <option value="">Todas</option>
            {(opts?.subcategories || []).map((v: string) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tipo</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.type || ""}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="">Todos</option>
            {(opts?.types || []).map((v: string) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(kpis || []).map((k: any) => (
          <div key={k.label} className="rounded-2xl bg-white shadow p-4">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="text-2xl font-semibold">{peso(k.value)}</div>
          </div>
        ))}
      </section>

      {/* Ingresos vs Egresos */}
      <section className="rounded-2xl bg-white shadow p-4">
        <h2 className="font-semibold mb-2">Ingresos vs Egresos por mes</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={ie || []}>
              <XAxis dataKey="periodo" />
              <YAxis tickFormatter={(v) => peso(Number(v))} />
              <Tooltip formatter={(v) => peso(Number(v))} />
              <Legend />
              <Bar dataKey="ingresos" />
              <Bar dataKey="egresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Honorarios por Asesor */}
      <section className="rounded-2xl bg-white shadow p-4">
        <h2 className="font-semibold mb-2">Honorarios por asesor</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={asesores || []}>
              <XAxis dataKey="advisor" />
              <YAxis tickFormatter={(v) => peso(Number(v))} />
              <Tooltip formatter={(v) => peso(Number(v))} />
              <Bar dataKey="honorarios" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Egresos por categoría */}
      <section className="rounded-2xl bg-white shadow p-4">
        <h2 className="font-semibold mb-2">Egresos por categoría</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={egresosPie || []} dataKey="monto" nameKey="category" label>
                {(egresosPie || []).map((_: any, i: number) => <Cell key={i} />)}
              </Pie>
              <Tooltip formatter={(v) => peso(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Portales por mes */}
      <section className="rounded-2xl bg-white shadow p-4">
        <h2 className="font-semibold mb-2">Gastos en Portales por mes</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={portales || []}>
              <XAxis dataKey="periodo" />
              <YAxis tickFormatter={(v) => peso(Number(v))} />
              <Tooltip formatter={(v) => peso(Number(v))} />
              <Bar dataKey="total_egresos_portales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
