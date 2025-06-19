import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable, forkJoin, from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { IonSegment, IonSegmentButton, IonSearchbar, IonCardContent, IonCard, IonContent, IonTitle, IonToolbar, IonHeader} from '@ionic/angular/standalone';

interface PokemonListItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
  offset = 0;
  limit = 30;
  loading = false;
  allLoaded = false;

  types: any[] = [{ name: 'All', url: '' }];
  selectedType: string = '';
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadTypes();
    this.loadPokemons();
  }

  loadTypes() {
    this.pokemonService.getPokemonTypes().subscribe((res) => {
      this.types = res.results;
    });
  }

  loadPokemons() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((res) => {
      const pokemonRequests: Observable<any>[] = res.results.map((p: PokemonListItem) =>
        this.pokemonService.getPokemonDetails(p.name)
      );

      forkJoin(pokemonRequests).subscribe((details) => {
        this.pokemons = [...this.pokemons, ...details];
        this.applyFilters();
        this.offset += this.limit;
        this.loading = false;

        // Depois de carregar a primeira página, inicia o carregamento do restante em background
        if (this.offset === this.limit) {
          this.loadRemainingPokemonsInBackground();
        }

        if (res.next === null) {
          this.allLoaded = true;
        }
      });
    });
  }

  loadRemainingPokemonsInBackground() {
    const totalPokemons = 10277;
    let remainingRequests: Observable<any>[] = [];
    let currentOffset = this.offset;

    while (currentOffset < totalPokemons) {
      remainingRequests.push(this.pokemonService.getPokemonList(currentOffset, 100));
      currentOffset += 100;
    }

    forkJoin(remainingRequests).subscribe((responses) => {
      let allResults: any[] = [];
      responses.forEach((res: any) => {
        allResults.push(...res.results);
      });

      const validResults = allResults.filter((p: any) => {
        const id = this.extractIdFromUrl(p.url);
        return (id >= 1 && id <= 1025) || (id >= 10001 && id <= 10277);
      });

      const detailRequests = validResults.map((p) => this.pokemonService.getPokemonDetails(p.name));

      forkJoin(detailRequests).subscribe((details) => {
        const existingIds = new Set(this.pokemons.map(p => p.id));
        const newPokemons = details.filter(p => !existingIds.has(p.id));

        this.pokemons = [...this.pokemons, ...newPokemons];
        this.applyFilters();
        this.allLoaded = true;
      });
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
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
    }

    this.displayedPokemons = filtered;
  }

  getPokemonImage(pokemon: any) {
    return pokemon.sprites?.front_default;
  }
}