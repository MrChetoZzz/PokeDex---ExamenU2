import { useRegistry } from '../RegistryContext.tsx';

export default function RegistrySummary() {
  const { registry } = useRegistry();
  const titularCount = registry.filter((entry) => entry.role === 'titular').length;
  const reserveCount = registry.filter((entry) => entry.role === 'reserva').length;

  return (
    <section className="summary" aria-label="Resumen de registros">
      <article className="stat"><span>Total</span><strong>{registry.length}</strong></article>
      <article className="stat"><span>Titulares</span><strong className="text-amber">{titularCount}</strong></article>
      <article className="stat"><span>Reservas</span><strong className="text-green">{reserveCount}</strong></article>
    </section>
  );
}
