import { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

async function DashboardData() {
  const { data: cuentas, error } = await supabaseServer
    .from('v_mes_cuenta')
    .select('*')
    .order('inversion', { ascending: false });

  if (error) {
    return (
      <div role="alert" className="glass state-panel">
        <h2>No pudimos cargar las métricas</h2><p>Intenta recargar la página en unos momentos.</p><form action="/" method="get"><button className="glass-link" type="submit">Volver a intentar ↗</button></form>
      </div>
    );
  }

  const inversionTotal = cuentas?.reduce((acc, c) => acc + Number(c.inversion || 0), 0) || 0;
  const registrosTotales = cuentas?.reduce((acc, c) => acc + Number(c.registros_completados || 0), 0) || 0;
  const leadsTotales = cuentas?.reduce((acc, c) => acc + Number(c.leads || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <section className="metrics-grid" aria-label="Resumen de métricas">
        <div className="glass metric-card">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Inversión del mes</span><span className="metric-symbol" aria-hidden="true">↗</span>
          <p className="text-3xl font-extrabold mt-2 text-slate-900">
            ${inversionTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })} <small>COP</small>
          </p>
        </div>
        <div className="glass metric-card">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Registros completados</span><span className="metric-symbol" aria-hidden="true">◎</span>
          <p className="text-3xl font-extrabold mt-2 text-indigo-600">
            {registrosTotales.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="glass metric-card">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Leads totales</span><span className="metric-symbol" aria-hidden="true">✧</span>
          <p className="text-3xl font-extrabold mt-2 text-emerald-600">
            {leadsTotales.toLocaleString('es-CO')}
          </p>
        </div>
      </section>

      <section className="glass accounts-panel" id="cuentas">
        <div className="table-heading">
          <div><p className="eyebrow">EN DETALLE</p><h2>Rendimiento por cuenta</h2><p>Una mirada a cada cuenta y vertical.</p></div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            {cuentas?.length || 0} cuentas
          </span>
        </div>

        <div className="table-scroll" role="region" aria-label="Rendimiento por cuenta, tabla desplazable" tabIndex={0}>
          <table className="w-full text-left text-sm"><caption className="sr-only">Métricas mensuales por cuenta. Valores monetarios en pesos colombianos.</caption>
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th scope="col" className="py-3 px-4">Cliente / Cuenta</th>
                <th scope="col" className="py-3 px-4">Vertical</th>
                <th scope="col" className="py-3 px-4 text-right">Inversión</th>
                <th scope="col" className="py-3 px-4 text-right">Impresiones</th>
                <th scope="col" className="py-3 px-4 text-right">Registros</th>
                <th scope="col" className="py-3 px-4 text-right">Costo / Reg.</th>
                <th scope="col" className="py-3 px-4 text-right">Leads</th>
                <th scope="col" className="py-3 px-4 text-right">Costo / Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {!cuentas?.length && <tr><td colSpan={8} className="empty-state">Aún no hay métricas disponibles para mostrar.</td></tr>}
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
    <main className="dashboard-shell">
      <div className="dashboard-content">
        <header className="glass topbar">
          <Link href="/" className="brand" aria-label="Terminator Ads, inicio"><span className="brand-mark" aria-hidden="true">t.</span><span>terminator<span className="brand-light"> / ads</span></span></Link>
          <span className="workspace-label">Workspace <span> / </span> Meta Ads</span>
          <a href="#cuentas" className="glass-link">Ver cuentas <span aria-hidden="true">↗</span></a>
        </header>
        <section className="hero" aria-labelledby="dashboard-title">
          <div><p className="eyebrow"><span className="status-dot" /> META ADS · VISIÓN GENERAL</p>
          <h1 id="dashboard-title">Claridad en cada<br /><span>resultado.</span></h1>
          <p className="hero-description">Tu inversión, tus cuentas y su rendimiento.<br />Todo en una sola perspectiva.</p></div>
          <div className="glass hero-note"><span className="note-icon" aria-hidden="true">↗</span><p>Tu próximo movimiento<br /><strong>empieza con los datos.</strong></p><span className="note-label">RESUMEN MENSUAL · COP</span></div>
        </section>
        <Suspense fallback={<div className="glass state-panel" role="status"><div className="loading-line" /><p>Cargando tus métricas…</p></div>}>
          <DashboardData />
        </Suspense>
        <footer className="dashboard-footer"><span>TERMINATOR ADS</span><span>Una perspectiva más clara de tu rendimiento.</span></footer>
      </div>
    </main>
  );
}
