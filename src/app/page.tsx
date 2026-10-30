import { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabaseServer';

async function DashboardData() {
  const { data: cuentas, error } = await supabaseServer
    .from('v_mes_cuenta')
    .select('*')
    .order('inversion', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-600 font-mono">
        Error al consultar Supabase: {error.message}
      </div>
    );
  }

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
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Octubre 2026
          </span>
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
                <tr key={row.account_id} className="hover:bg-slate-50/80 transition-colors">
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

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-sans">Cargando métricas desde Supabase...</div>}>
          <DashboardData />
        </Suspense>
      </div>
    </main>
  );
}
