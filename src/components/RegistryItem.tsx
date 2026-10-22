import { useRegistry, type RegistryEntry } from '../RegistryContext.tsx';

export default function RegistryItem({ entry }: { entry: RegistryEntry }) {
  const { dispatch } = useRegistry();
  const typeClass = `type-${entry.type}`;

  return (
    <article className="ticket">
      <div className="ticket-top">
        <span className="ticket-id">Registro {entry.entryID.slice(0, 8)}</span>
        <div className="badges">
          <span className={`badge ${typeClass}`}>{entry.type}</span>
          <span className={`badge role-${entry.role}`}>{entry.role === 'titular' ? 'Titular' : 'Reserva'}</span>
        </div>
      </div>
      <div className="preview">
        {entry.image.trim() && <img src={entry.image} alt={`Imagen de ${entry.name}`} width={72} height={72} />}
        <div>
          <h3>{entry.nickname}</h3>
          <p className="requester">#{entry.id} {entry.name}</p>
        </div>
      </div>
      <div className="ticket-actions">
        <button
          className="button danger"
          type="button"
          onClick={() => dispatch({ type: 'remove', entryID: entry.entryID })}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
