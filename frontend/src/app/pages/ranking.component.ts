import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {LigaApi, RankingItem} from '../services/liga-api.service';
import {EquipoStateService} from '../services/equipo-state.service';

@Component({standalone: true, imports: [CommonModule], template: `
<h1>Ranking</h1><p class="lead">Clasificacion acumulada de la temporada.</p><p class="notice" *ngIf="loading">Cargando ranking...</p><p class="error" *ngIf="error">{{error}} <button type="button" (click)="cargar()">Reintentar</button></p><p class="notice" *ngIf="!loading && !error && !ranking.length">Aun no hay puntos registrados.</p><section class="ranking"><article *ngFor="let jugador of ranking" [class.current-player]="jugador.esUsuarioActual"><strong [class.gold-medal]="jugador.puesto === 1" [class.silver-medal]="jugador.puesto === 2" [class.bronze-medal]="jugador.puesto === 3">#{{jugador.puesto}}</strong><span>{{jugador.nombre}}</span><b>{{jugador.puntosTotales | number:'1.0-1'}} pts</b><small *ngIf="jugador.variacionPuestos > 0" class="success">▲ {{jugador.variacionPuestos}}</small><small *ngIf="jugador.variacionPuestos < 0" class="warning">▼ {{-jugador.variacionPuestos}}</small></article></section>`, styles: [`.current-player{border:2px solid #a3e635!important}.gold-medal{color:#b7791f}.silver-medal{color:#64748b}.bronze-medal{color:#9a3412}`]})
export class RankingComponent {
  private api = inject(LigaApi); private equipoState = inject(EquipoStateService); ranking: RankingItem[] = []; loading = false; error = '';
  constructor() { this.equipoState.cargar(); this.equipoState.activo$.subscribe(equipo => { if (equipo) this.cargar(equipo.id); }); }
  cargar(equipoId?: string) { const id = equipoId || this.equipoState.activo?.id; if (!id) return; this.loading = true; this.error = ''; this.api.ranking(id).subscribe({next: ranking => {this.ranking = ranking; this.loading = false;}, error: () => {this.error = 'No se pudo cargar el ranking.'; this.loading = false;}}); }
}
