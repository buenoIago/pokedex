import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ObjetoRespostaHttp, PokemonRespostaHttp } from './pokemon.dto';
import { PokemonDetails, Pokemon } from '../pokemon.model';

export const POKE_API_URL = new InjectionToken<string>('POKE_API_URL');

function mapearRespostaPokemon(dto: PokemonRespostaHttp): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    types: dto.types.map((item) => item.type.name),
    spriteUrl: dto.sprites.front_default,
  };
}

function mapearRespostaDetalhesPokemon(dto: PokemonRespostaHttp): PokemonDetails {
  return {
    ...mapearRespostaPokemon(dto),
    imageUrl: dto.sprites.other?.['official-artwork']?.front_default ?? dto.sprites.front_default,
    audioUrl: dto.cries?.latest ?? dto.cries?.legacy ?? null,
    height: dto.height,
    weight: dto.weight,
    abilities: dto.abilities.map(({ ability }) => ability.name),
    stats: dto.stats.map(({ stat, base_stat }) => ({ name: stat.name, baseValue: base_stat })),
  };
}


@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(POKE_API_URL);

  listar(pagina: number = 1, limite: number = 24): Observable<Pokemon[]> {
    const offset = (pagina - 1) * limite;
    const url = `${this.apiUrl}?limit=${limite}&offset=${offset}`;

    // O primeiro GET traz apenas os nomes e as URLs dos Pokémons da página solicitada.
    return this.http.get<ObjetoRespostaHttp>(url).pipe(
      switchMap((obj) => {
        // Criamos uma requisição de detalhe para cada Pokémon da listagem.
        const requisicoes = obj.results.map((r) =>
          this.http.get<PokemonRespostaHttp>(r.url),
        );

        // forkJoin espera todas as requisições terminarem e emite um array
        // com as respostas na mesma ordem das requisições.
        return forkJoin(requisicoes);
      }),
      // Este map do RxJS transforma a emissão do Observable.
      map((detalhes: PokemonRespostaHttp[]): Pokemon[] =>
        // Este map do array transforma cada resposta bruta em Pokémon.
        detalhes.map(mapearRespostaPokemon),
      ),
    );
  }

  buscarPorNome(nome: string): Observable<PokemonDetails> {
    const nomeNormalizado = nome.trim().toLowerCase();

    const urlCompleto = `${this.apiUrl}${nomeNormalizado}`;

    return this.http
      .get<PokemonRespostaHttp>(`${this.apiUrl}${encodeURIComponent(nomeNormalizado)}`)
      .pipe(map(mapearRespostaDetalhesPokemon));
  }

  buscarPorId(id: number): Observable<PokemonDetails> {
    return this.http
      .get<PokemonRespostaHttp>(`${this.apiUrl}${id}`)
      .pipe(map(mapearRespostaDetalhesPokemon));
  }
}