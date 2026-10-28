import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Equipo, EstadoJugador, LigaApi} from '../services/liga-api.service';
import {EquipoStateService} from '../services/equipo-state.service';

@Component({standalone: true, imports: [CommonModule, FormsModule], template: `
<section class="page-heading"><div><p class="eyebrow">Post-partido</p><h1>Jornada</h1></div><span class="page-count">{{valorados}}/{{estado.length}}</span></section>
<section class="voting-banner"><strong>Valora el partido de hoy</strong><span>No lo bueno que es en general. Un partido normal es un 5-6.</span></section>
<section class="toolbar" *ngIf="partidos.length"><label>Partido<select [(ngModel)]="partidoId" (ngModelChange)="cargar()"><option *ngFor="let p of partidos" [value]="p.id">J{{p.numeroJornada}} · {{p.nombreRival}}</option></select></label></section>
<p class="notice" *ngIf="partido && partido.estado !== 'VOTACION' && partido.estado !== 'CERRADO'">La votacion se habilitara al finalizar el partido.</p>
<section class="vote-card" *ngFor="let item of estado"><div class="vote-header"><span class="player-avatar" [style.background]="colorAvatar(item.jugador.apodo)">{{iniciales(item.jugador.apodo)}}</span><div><strong>{{item.jugador.apodo}}</strong><span class="position-badge" [class]="clasePosicion(item.jugador.posicionPrincipal)">{{item.jugador.posicionPrincipal}}</span></div><button type="button" class="mvp-button" [class.mvp-active]="mvpId === item.jugador.id" (click)="toggleMvp(item.jugador.id)">{{mvpId === item.jugador.id ? '★ MVP' : '☆ MVP'}}</button></div><div class="score-strip"><button type="button" *ngFor="let nota of notasDisponibles" [class]="claseNota(item.jugador.id, nota)" (click)="seleccionarNota(item.jugador.id, nota)">{{nota}}</button></div></section>
<div class="vote-footer"><strong>Votados {{valorados}}/{{estado.length}}</strong><button type="button" [disabled]="!estado.length || valorados !== estado.length" (click)="enviar()">Enviar votos</button></div><p class="success" *ngIf="mensaje">{{mensaje}}</p><p class="error" *ngIf="error">{{error}}</p>
`})
export class JornadaComponent {
  private api = inject(LigaApi); private equipoState = inject(EquipoStateService); equipo: Equipo|null = null; partidos: any[] = []; partidoId = ''; partido: any = null; estado: EstadoJugador[] = []; notas: Record<string, number> = {}; mvpId = ''; mensaje = ''; error = ''; notasDisponibles = Array.from({length: 13}, (_, index) => index - 2);
  constructor() { this.equipoState.cargar(); this.equipoState.activo$.subscribe(equipo => { this.equipo = equipo; if (equipo) this.api.partidos(equipo.id).subscribe(partidos => { this.partidos = partidos; this.partido = partidos[0] || null; this.partidoId = this.partido?.id || ''; this.cargar(); }); }); }
  cargar() { this.partido = this.partidos.find(item => item.id === this.partidoId); if (this.partidoId) this.api.estadoPartido(this.partidoId).subscribe(items => { this.estado = items; this.notas = {}; this.mvpId = ''; }); }
  get valorados() { return this.estado.filter(item => this.notas[item.jugador.id] !== undefined).length; }
  seleccionarNota(id: string, nota: number) { this.notas[id] = nota; }
  toggleMvp(id: string) { this.mvpId = this.mvpId === id ? '' : id; }
  claseNota(id: string, nota: number) { if (this.notas[id] !== nota) return 'score-button'; return nota <= 4 ? 'score-button score-low' : nota <= 6 ? 'score-button score-standard' : nota <= 8 ? 'score-button score-good' : 'score-button score-excellent'; }
  clasePosicion(posicion: string) { return posicion === 'DEF' ? 'badge-def' : posicion === 'DEL' ? 'badge-del' : 'badge-med'; }
  iniciales(apodo: string) { return apodo.split(' ').map(parte => parte[0]).join('').slice(0, 2).toUpperCase(); }
  colorAvatar(apodo: string) { return ['#bae6fd','#fecdd3','#ddd6fe','#bbf7d0'][apodo.length % 4]; }
  enviar() { this.error = ''; this.estado.forEach(item => this.api.votar({partido: {id: this.partidoId}, jugadorEvaluado: {id: item.jugador.id}, nota: Number(this.notas[item.jugador.id]), votoMvp: item.jugador.id === this.mvpId}).subscribe({error: (error: any) => this.error = error.error?.message || 'No se pudo registrar la votacion.'})); this.mensaje = 'Votacion enviada.'; }
}
