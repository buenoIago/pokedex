import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map, switchMap } from 'rxjs';

interface ResultadoObjetoHttp {
  name: string;
  url: string;
}

interface ObjetoRespostaHttp {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultadoObjetoHttp[];
}

interface TipoPokemonRespostaHttp {
  type: {
    name: string;
  };
}

interface PokemonRespostaHttp {
  id: number;
  name: string;
  types: TipoPokemonRespostaHttp[];
  sprites: {
    front_default: string | null;
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string | null;
}

@Component({
  imports: [],
  selector: 'app-listagem-pokemon',
  templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  protected readonly pokemon = toSignal(
    // O primeiro GET traz apenas os nomes e as URLs dos Pokémons.
    this.http.get<ObjetoRespostaHttp>(this.apiUrl).pipe(
      switchMap((obj) => {
        // Criamos uma requisicão de detalhe para cada Pokémon da listagem.
        const requisicoes = obj.results.map((r) => this.http.get<PokemonRespostaHttp>(r.url));

        // forkJoin espera todas as requisicões terminarem e emite um array
        // com as respostas na mesma ordem das requisicoes.
        return forkJoin(requisicoes);
      }),
      // Este map é do RxJS: transforma a emissão do Observable.
      map((detalhes: PokemonRespostaHttp[]): Pokemon[] =>
        // Este map é do array: transforma cada resposta bruta em Pokémon.
        detalhes.map((detalhe) => ({
          id: detalhe.id,
          name: detalhe.name,
          types: detalhe.types.map((item) => item.type.name),
          sprite: detalhe.sprites.front_default,
        })),
      ),
    ),
    { initialValue: null },
  );

  protected paraTitleCase(texto: string): string {
    // Este regex (/\b\w/g) varre o texto procurando a primeira letra de cada palavra
    return texto.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }
}