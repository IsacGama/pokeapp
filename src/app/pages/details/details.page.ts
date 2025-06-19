import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';

interface AbilityDetails {
  types?: { type: { name: string } }[];
}

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
  ]
})
export class DetailsPage implements OnInit {
  pokemon: any;
  pokemonId: string | null = null;
  loading = true;
  abilitiesWithTypes: { name: string; type: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.pokemonId = this.route.snapshot.paramMap.get('id');

    if (this.pokemonId) {
      this.pokemonService.getPokemonDetails(this.pokemonId).subscribe((res) => {
        this.pokemon = res;
        this.loadAbilitiesDetails();
        this.loading = false;
      });
    }
  }

  loadAbilitiesDetails() {
    if (!this.pokemon?.abilities?.length) {
      this.abilitiesWithTypes = [];
      return;
    }

    const abilityRequests = this.pokemon.abilities.map((ability: any) => 
      this.pokemonService.getAbilityDetails(ability.ability.name)
    );

    forkJoin<AbilityDetails[]>(abilityRequests).subscribe({
      next: (results) => {
        this.abilitiesWithTypes = results.map((abilityDetails, index) => {
          const abilityName = this.pokemon.abilities[index].ability.name;
          const abilityType = abilityDetails?.types?.[0]?.type?.name || 'normal';
          return {
            name: abilityName,
            type: abilityType
          };
        });
      },
      error: (error) => {
        console.error('Error loading ability details:', error);
        this.abilitiesWithTypes = this.pokemon.abilities.map((a: any) => ({
          name: a.ability.name,
          type: 'normal'
        }));
      }
    });
  }

  getPokemonImage() {
    return this.pokemon?.sprites?.other?.['official-artwork']?.front_default;
  }

  getTypeColor(type: string): string {
    const colors: any = {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD'
    };
    return colors[type] || '#777';
  }

  formatStatName(statName: string): string {
    return statName.replace('-', ' ');
  }

  getStatColor(value: number): string {
    if (value >= 100) return '#4CAF50'; // Verde para stats altos
    if (value >= 50) return '#FFC107';  // Amarelo para stats médios
    return '#F44336';                   // Vermelho para stats baixos
  }
}
