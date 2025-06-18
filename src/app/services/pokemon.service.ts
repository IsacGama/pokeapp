import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Pega lista paginada de pokemons (pra infinite scroll)
  getPokemonList(offset: number = 0, limit: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }

  // Pega detalhes de um Pokémon (por nome ou id)
  getPokemonDetails(nameOrId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${nameOrId}`);
  }

  // Pega todos os tipos de pokémon
  getPokemonTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/type`);
  }

  // Pega lista de pokémons por tipo
  getPokemonsByType(typeName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${typeName}`).pipe(
      map((response: any) => response.pokemon.map((p: any) => p.pokemon))
    );
  }

  // Pega múltiplos detalhes de vários pokémons de uma vez (útil pro filtro por tipo)
  getMultiplePokemonDetails(pokemons: any[]): Observable<any[]> {
    const requests = pokemons.map(p => this.getPokemonDetails(p.name));
    return forkJoin(requests);
  }

  getAbilityDetails(abilityName: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/ability/${abilityName}/`);
  }
}
