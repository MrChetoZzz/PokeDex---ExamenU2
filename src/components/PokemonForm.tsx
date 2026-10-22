import { useActionState } from 'react';
import { useRegistry, type PokemonRole } from '../RegistryContext.tsx';

type RegistrationFeedback = {
  errors: string[];
  success: string;
};

const initialFeedback: RegistrationFeedback = { errors: [], success: '' };
const allowedRoles: PokemonRole[] = ['titular', 'reserva'];

function isPokemonRole(role: string): role is PokemonRole {
  return allowedRoles.some((allowedRole) => allowedRole === role);
}

export default function PokemonForm() {
  const { selectedPokemon, dispatch } = useRegistry();

  async function registerPokemon(
    _previousFeedback: RegistrationFeedback,
    formData: FormData,
  ): Promise<RegistrationFeedback> {
    const nickname = String(formData.get('nickname') ?? '').trim();
    const role = String(formData.get('role') ?? '');
    const errors: string[] = [];

    if (!selectedPokemon) {
      errors.push('Busca y carga un pokémon antes de registrarlo.');
    }
    if (nickname.length < 3) {
      errors.push('El apodo debe tener al menos 3 caracteres.');
    }
    if (!isPokemonRole(role)) {
      errors.push('Selecciona un rol válido: titular o reserva.');
    }
    if (errors.length > 0 || !selectedPokemon || !isPokemonRole(role)) {
      return { errors, success: '' };
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    dispatch({
      type: 'add',
      entry: {
        ...selectedPokemon,
        entryID: crypto.randomUUID(),
        nickname,
        role,
      },
    });
    return { errors: [], success: 'Pokemon registrado correctamente' };
  }

  const [feedback, formAction, isPending] = useActionState(registerPokemon, initialFeedback);

  return (
    <section className="panel" aria-labelledby="form-title">
      <div className="section-heading">
        <span className="step">02</span>
        <div>
          <h2 id="form-title">Datos del pokémon</h2>
          <p>La búsqueda llena estos campos. Después simula el registro.</p>
        </div>
      </div>
      <form className="ticket-form" noValidate action={formAction}>
        <div className="preview">
          {selectedPokemon?.image.trim() && (
            <img src={selectedPokemon.image} alt={`Imagen de ${selectedPokemon.name}`} width={72} height={72} />
          )}
          <div>
            <p className="ticket-id">{selectedPokemon ? `#${selectedPokemon.id}` : 'Sin selección'}</p>
            <strong>{selectedPokemon?.name ?? 'Ningún pokémon cargado'}</strong>
          </div>
        </div>
        <div className="field">
          <label htmlFor="pokemonId">Número</label>
          <input id="pokemonId" name="pokemonId" value={selectedPokemon?.id ?? ''} readOnly />
        </div>
        <div className="field">
          <label htmlFor="pokemonName">Nombre</label>
          <input id="pokemonName" name="pokemonName" value={selectedPokemon?.name ?? ''} readOnly />
        </div>
        <div className="field">
          <label htmlFor="type">Tipo</label>
          <input id="type" name="type" value={selectedPokemon?.type.trim() ? selectedPokemon.type : ''} readOnly />
        </div>
        <div className="field">
          <label htmlFor="nickname">Apodo</label>
          <input id="nickname" name="nickname" placeholder="Ej. Chispa" />
          <small>Mínimo 3 caracteres.</small>
        </div>
        <div className="field">
          <label htmlFor="role">Rol</label>
          <select id="role" name="role">
            <option value="">Selecciona un rol</option>
            <option value="titular">Titular</option>
            <option value="reserva">Reserva</option>
          </select>
        </div>
        <div
          className={`feedback ${feedback.errors.length > 0 ? 'error' : feedback.success ? 'success' : ''}`}
          aria-live="polite"
        >
          {feedback.errors.map((error) => <p className="error" key={error}>{error}</p>)}
          {feedback.success && <p className="success">{feedback.success}</p>}
        </div>
        <button className="button primary" type="submit" disabled={isPending}>
          {isPending ? 'Registrando…' : 'Registrar pokémon'}
        </button>
      </form>
    </section>
  );
}
