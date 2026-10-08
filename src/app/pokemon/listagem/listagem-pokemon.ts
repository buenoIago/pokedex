import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '../data/pokemon.service';
import { Pokemon, PokemonTypeViewModel } from '../pokemon.model';
import { map, startWith, switchMap } from 'rxjs';
import {
  obterCorDeBackgroundDosTipos,
  obterCorDoTipo,
  paraTiposViewModel,
  paraTitleCase,
} from '../pokemon.util';
import { RouterLink } from '@angular/router';

interface PokemonCardViewModel {
  readonly id: number;
  readonly name: string;
  readonly displayName: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string;
  readonly types: readonly PokemonTypeViewModel[];
  readonly background: string;
}

function paraCardViewModel(dto: Pokemon): PokemonCardViewModel {
  const displayName = paraTitleCase(dto.name);
  const types = paraTiposViewModel(dto.types);

  return {
  id: dto.id,
  name: dto.name,
  displayName: displayName,
  imageUrl: dto.spriteUrl,
  imageAlt: `Imagem de ${displayName}`,
  types: types,
  background: obterCorDeBackgroundDosTipos(types),
  };
}

@Component({
  imports: [RouterLink],
  selector: 'app-listagem-pokemon',
  styleUrl: './listagem-pokemon.scss',
  templateUrl: './listagem-pokemon.html',
})

export class ListagemPokemon {
  protected readonly pokemonService = inject(PokemonService);

  protected readonly pagina = signal(1);
  protected readonly limite = 24;

protected readonly pokemon = toSignal(
  toObservable(this.pagina).pipe(
    switchMap((pagina) =>
      this.pokemonService.listar(pagina, this.limite).pipe(
        map((pokemon) => pokemon.map(paraCardViewModel)),
        startWith([] as PokemonCardViewModel[]),
      ),
    ),
  ),
  {
    initialValue: [] as PokemonCardViewModel[],
  },
);

  protected proximaPagina(): void {
    this.pagina.update((pagina) => pagina + 1);
  }

  protected paginaAnterior(): void {
    this.pagina.update((pagina) => Math.max(1, pagina - 1));
  }
}
