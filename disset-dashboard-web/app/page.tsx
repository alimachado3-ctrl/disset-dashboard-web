"use client";
import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data: kpis } = useSWR("/api/kpis", fetcher);
  const { data: ie } = useSWR("/api/ingresos-egresos", fetcher);
  const { data: asesores } = useSWR("/api/honorarios-asesor", fetcher);
  const { data: egresosPie } = useSWR("/api/egresos-por-categoria", fetcher);
  const { data: portales } = useSWR("/api/portales-mensual", fetcher);

  return (
    <main className="p-6 grid gap-6">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(kpis || []).map((k: any) => (
          <div key={k.label} className="rounded-2xl bg-white shadow p-4">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="text-2xl font-semibold">
              ${Intl.NumberFormat("es-AR").format(k.value ?? 0)}
            </div>
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
              <YAxis />
              <Tooltip />
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
              <YAxis />
              <Tooltip />
              <Bar dataKey="honorarios" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Distribución Egresos por categoría */}
      <section className="rounded-2xl bg-white shadow p-4">
        <h2 className="font-semibold mb-2">Egresos por categoría</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={egresosPie || []} dataKey="monto" nameKey="category" label>
                {(egresosPie || []).map((_: any, i: number) => <Cell key={i} />)}
              </Pie>
              <Tooltip />
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
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_egresos_portales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
