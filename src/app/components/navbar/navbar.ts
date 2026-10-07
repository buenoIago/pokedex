import { Component, signal } from '@angular/core';

interface ItemNavbar {
  titulo: string;
  url: string;
}

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})

export class Navbar {
  protected readonly itensNavbar: ItemNavbar[] = [{ titulo: 'Início', url: '#' }];

  protected readonly menuAberto = signal(false);

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
