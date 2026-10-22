import { createContext, useContext, useReducer, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

export type PokemonDetails = {
  id: number;
  name: string;
  image: string;
  type: string;
};

export type PokemonRole = 'titular' | 'reserva';

export type RegistryEntry = PokemonDetails & {
  entryID: string;
  nickname: string;
  role: PokemonRole;
};

type RegistryAction =
  | { type: 'add'; entry: RegistryEntry }
  | { type: 'remove'; entryID: string };

function registryReducer(state: RegistryEntry[], action: RegistryAction): RegistryEntry[] {
  switch (action.type) {
    case 'add':
      return [...state, action.entry];
    case 'remove':
      return state.filter((entry) => entry.entryID !== action.entryID);
    default:
      return state;
  }
}

type RegistryContextValue = {
  registry: RegistryEntry[];
  dispatch: Dispatch<RegistryAction>;
  selectedPokemon: PokemonDetails | null;
  setSelectedPokemon: Dispatch<SetStateAction<PokemonDetails | null>>;
};

const RegistryContext = createContext<RegistryContextValue | null>(null);

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [registry, dispatch] = useReducer(registryReducer, []);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  return (
    <RegistryContext.Provider value={{ registry, dispatch, selectedPokemon, setSelectedPokemon }}>
      {children}
    </RegistryContext.Provider>
  );
}

// The hook is exported alongside the provider so all registry consumers share the same context.
// eslint-disable-next-line react-refresh/only-export-components
export function useRegistry() {
  const context = useContext(RegistryContext);
  if (context === null) {
    throw new Error('useRegistry debe usarse dentro de RegistryProvider.');
  }
  return context;
}
