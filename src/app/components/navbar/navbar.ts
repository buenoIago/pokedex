import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);

  protected readonly itensNavbar: ItemNavbar[] = [{ titulo: '', url: '' }];
  protected readonly menuAberto = signal(false);
  protected readonly nomeBusca = signal('');

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

  protected atualizarBusca(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nomeBusca.set(input.value);
  }

  protected buscarPokemon(event: SubmitEvent): void {
    event.preventDefault();

    const nome = this.nomeBusca().trim().toLowerCase();

    if (!nome) {
      return;
    }

    this.fecharMenu();
    this.router.navigate(['/pokemon', nome]);
  }
}