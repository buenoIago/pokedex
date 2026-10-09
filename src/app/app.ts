import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { ListagemFavoritos } from './pokemon/favoritos/listagem-favoritos';

@Component({
  imports: [Navbar, RouterOutlet, ListagemFavoritos],
  selector: 'app-root',
  templateUrl: './app.html',
})

export class App {}
