import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

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

@Component({
  imports: [],
  selector: 'app-listagem-pokemon',
  templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  protected readonly objetoResposta = toSignal(this.http.get<ObjetoRespostaHttp>(this.apiUrl), {
    initialValue: null,
  });
}