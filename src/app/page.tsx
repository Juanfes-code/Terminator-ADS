import { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// `mes` llega de Supabase como 'YYYY-MM-DD' (primer día del mes).
function etiquetaMes(mes: string) {
  const [anio, m] = mes.split('-').map(Number);
  const texto = new Date(Date.UTC(anio, m - 1, 1)).toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function ErrorSupabase({ mensaje }: { mensaje: string }) {
  return (
    <div className="p-8 text-red-600 font-mono">
      Error al consultar Supabase: {mensaje}
    </div>
  );
}

async function DashboardData({ searchParams }: { searchParams: SearchParams }) {
  const { data: filasMeses, error: errorMeses } = await supabaseServer
    .from('v_mes_cuenta')
    .select('mes')
    .order('mes', { ascending: false });

  if (errorMeses) return <ErrorSupabase mensaje={errorMeses.message} />;

  const meses = [...new Set((filasMeses ?? []).map((f) => String(f.mes)))];
  if (meses.length === 0) {
    return <div className="p-8 text-center text-slate-500">No hay datos en v_mes_cuenta.</div>;
  }

  // ?mes=2026-10 selecciona un mes; por defecto, el más reciente.
  const { mes: mesParam } = await searchParams;
  const pedido = typeof mesParam === 'string' ? mesParam.slice(0, 7) : undefined;
  const mesSeleccionado = meses.find((m) => m.slice(0, 7) === pedido) ?? meses[0];

  const { data: cuentas, error } = await supabaseServer
    .from('v_mes_cuenta')
    .select('*')
    .eq('mes', mesSeleccionado)
    .order('inversion', { ascending: false });

  if (error) return <ErrorSupabase mensaje={error.message} />;

  const inversionTotal = cuentas?.reduce((acc, c) => acc + Number(c.inversion || 0), 0) || 0;
  const registrosTotales = cuentas?.reduce((acc, c) => acc + Number(c.registros_completados || 0), 0) || 0;
  const leadsTotales = cuentas?.reduce((acc, c) => acc + Number(c.leads || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel de Rendimiento Meta Ads</h1>
        <p className="text-sm text-slate-500">Métricas consolidadas desde Supabase</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Inversión Total Mes</span>
          <p className="text-3xl font-extrabold mt-2 text-slate-900">
            ${inversionTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Registros Completados</span>
          <p className="text-3xl font-extrabold mt-2 text-indigo-600">
            {registrosTotales.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Leads Totales</span>
          <p className="text-3xl font-extrabold mt-2 text-emerald-600">
            {leadsTotales.toLocaleString('es-CO')}
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">Desempeño por Cuenta y Vertical</h2>
          <nav className="flex flex-wrap gap-2" aria-label="Seleccionar mes">
            {meses.map((m) => {
              const activo = m === mesSeleccionado;
              return (
                <Link
                  key={m}
                  href={`/?mes=${m.slice(0, 7)}`}
                  aria-current={activo ? 'page' : undefined}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    activo ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {etiquetaMes(m)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4">Cliente / Cuenta</th>
                <th className="py-3 px-4">Vertical</th>
                <th className="py-3 px-4 text-right">Inversión</th>
                <th className="py-3 px-4 text-right">Impresiones</th>
                <th className="py-3 px-4 text-right">Registros</th>
                <th className="py-3 px-4 text-right">Costo / Reg.</th>
                <th className="py-3 px-4 text-right">Leads</th>
                <th className="py-3 px-4 text-right">Costo / Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {cuentas?.map((row) => (
                <tr key={`${row.account_id}-${row.mes}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900 text-sm">{row.cliente}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      row.vertical === 'Dropi' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {row.vertical}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    ${Number(row.inversion).toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {Number(row.impresiones).toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-700 font-bold">
                    {Number(row.registros_completados).toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {row.costo_por_registro ? `$${Number(row.costo_por_registro).toLocaleString('es-CO')}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-bold">
                    {Number(row.leads).toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {row.costo_por_lead ? `$${Number(row.costo_por_lead).toLocaleString('es-CO')}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-sans">Cargando métricas desde Supabase...</div>}>
          <DashboardData searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
