import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { POKE_API_URL } from './pokemon/data/pokemon.service';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemon',
    pathMatch: 'full',
  },
  {
    path: 'pokemon',
    // Lazy Loading
    loadComponent: () =>
      import('./pokemon/listagem/listagem-pokemon').then((component) => component.ListagemPokemon),
  },
  {
    path: 'pokemon/:name',
    loadComponent: () =>
      import('./pokemon/detalhes/detalhes-pokemon').then((component) => component.DetalhesPokemon),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: POKE_API_URL,
      useValue: 'https://pokeapi.co/api/v2/pokemon/',
    },
  ],
};