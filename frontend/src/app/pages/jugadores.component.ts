import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-heading"><div><p class="eyebrow">Mercado</p><h1>Jugadores</h1></div><span class="page-count">0 activos</span></section>
    <section class="notice empty-state"><strong>El mercado está preparando sus datos</strong><p>Cuando haya plantilla e historial de jornadas, aquí podrás comparar valores desde Ini hasta la última jornada.</p></section>
  `
})
export class JugadoresComponent {}