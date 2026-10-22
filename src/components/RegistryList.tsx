import EmptyState from './EmptyState.tsx';
import RegistryItem from './RegistryItem.tsx';
import { useRegistry } from '../RegistryContext.tsx';

export default function RegistryList() {
  const { registry } = useRegistry();

  return (
    <section className="panel list-panel" aria-labelledby="list-title">
      <div className="section-heading">
        <span className="step">03</span>
        <div>
          <h2 id="list-title">Registros</h2>
          
        </div>
      </div>
      <div className="ticket-list">
        {registry.length === 0
          ? <EmptyState />
          : registry.map((entry) => <RegistryItem key={entry.entryID} entry={entry} />)}
      </div>
    </section>
  );
}
