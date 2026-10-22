import { useState, type FormEvent } from 'react';
import { useRegistry, type PokemonDetails } from '../RegistryContext.tsx';

type PokemonApiResponse = {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: Array<{ type: { name: string } }>;
};

export default function PokemonSearch() {
  const { setSelectedPokemon } = useRegistry();
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = query.trim().toLowerCase();

    if (name.length < 3) {
      setFeedback('Escribe al menos 3 caracteres para buscar.');
      return;
    }

    setIsSearching(true);
    setFeedback('');
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (response.status === 404) {
        setFeedback('Sin resultados');
        return;
      }
      if (!response.ok) {
        setFeedback('No se pudo consultar PokeAPI');
        return;
      }

      const data = (await response.json()) as PokemonApiResponse;
      const pokemon: PokemonDetails = {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default ?? ' ',
        type: data.types[0]?.type.name ?? ' ',
      };
      setSelectedPokemon(pokemon);
    } catch {
      setFeedback('No se pudo consultar PokeAPI');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="search-title">
      <div className="section-heading">
        <span className="step">01</span>
        <div>
          <h2 id="search-title">Buscar pokémon</h2>
          <p>Escribe el nombre exacto para cargarlo en el formulario.</p>
        </div>
      </div>
      <form className="ticket-form" noValidate onSubmit={handleSearch}>
        <div className="field">
          <label htmlFor="query">Nombre</label>
          <input
            id="query"
            name="query"
            placeholder="Ej. pikachu"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <small>Mínimo 3 caracteres.</small>
        </div>
        <div className={feedback ? 'feedback error' : 'feedback'} aria-live="polite">{feedback}</div>
        <button className="button primary" type="submit" disabled={isSearching}>
          {isSearching ? 'Buscando…' : 'Buscar'}
        </button>
      </form>
    </section>
  );
}
