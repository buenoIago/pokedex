import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ObjetoRespostaHttp, PokemonRespostaHttp } from './pokemon.dto';
import { Pokemon } from '../pokemon.model';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapearRespostaPokemon(dto: PokemonRespostaHttp): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    types: dto.types.map((item) => item.type.name),
    sprite: dto.sprites.front_default,
  };
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(POKE_API_URL);

  listar(): Observable<Pokemon[]> {
    // O primeiro GET traz apenas os nomes e as URLs dos Pokémons.
    return this.http.get<ObjetoRespostaHttp>(this.apiUrl).pipe(
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
        detalhes.map(mapearRespostaPokemon),
      ),
    );
  }
}