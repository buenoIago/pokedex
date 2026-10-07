import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { ListagemPokemon } from './pokemon/listagem/listagem-pokemon';

@Component({
  imports: [Navbar, RouterOutlet, ListagemPokemon],
  selector: 'app-root',
  templateUrl: './app.html',
})

export class App {}
