import { Component,  inject,  signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from './favoritos.service';
import { paraTitleCase } from '../pokemon.util';

@Component({
  imports: [RouterLink],
  selector: 'app-listagem-favoritos',
  templateUrl: './listagem-favoritos.html',
})

export class ListagemFavoritos {
  private readonly favoritosService = inject(FavoritosService);
  protected readonly favoritos = this.favoritosService.favoritos;
  protected readonly paraTitleCase = paraTitleCase;
}
