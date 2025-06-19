import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { IonSegment, IonSegmentButton, IonSearchbar, IonCardContent, IonCard, IonContent, IonTitle, IonToolbar, IonHeader } from '@ionic/angular/standalone';

interface PokemonListItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    RouterLink,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonCardContent,
    IonCard,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  displayedPokemons: any[] = [];
  loading = true;

  types: any[] = [{ name: 'All', url: '' }];
  selectedType: string = '';
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadTypes();
    this.loadAllPokemons();
  }

  loadTypes() {
    this.pokemonService.getPokemonTypes().subscribe(res => {
      this.types = res.results;
    });
  }

  loadAllPokemons() {
    const totalPokemons = 10277;
    const batchSize = 100;
    const requests: Observable<any>[] = [];

    for (let offset = 0; offset < totalPokemons; offset += batchSize) {
      requests.push(this.pokemonService.getPokemonList(offset, batchSize));
    }

    forkJoin(requests).subscribe({
      next: responses => {
        // Junta todos os resultados
        let allResults: PokemonListItem[] = [];
        responses.forEach(res => allResults.push(...res.results));

        // Filtra pokemons válidos conforme ids
        const validResults = allResults.filter(p => {
          const id = this.extractIdFromUrl(p.url);
          return (id >= 1 && id <= 1025) || (id >= 10001 && id <= 10277);
        });

        // Agora pega os detalhes
        const detailRequests = validResults.map(p => this.pokemonService.getPokemonDetails(p.name));

        forkJoin(detailRequests).subscribe({
          next: details => {
            this.pokemons = details;
            this.applyFilters();
            this.loading = false;
          },
          error: err => {
            console.error('Erro carregando detalhes dos pokemons', err);
            this.loading = false;
          }
        });
      },
      error: err => {
        console.error('Erro carregando lista de pokemons', err);
        this.loading = false;
      }
    });
  }

  extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter(part => part);
    return Number(parts[parts.length - 1]);
  }

  onSearchChange() {
    this.applyFilters();
  }

  filterByType(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.pokemons];

    if (this.selectedType && this.selectedType !== '') {
      filtered = filtered.filter(p => p.types.some((t: any) => t.type.name === this.selectedType));
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    this.displayedPokemons = filtered;
  }

  getPokemonImage(pokemon: any) {
    return pokemon.sprites?.front_default;
  }
}