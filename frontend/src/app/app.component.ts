import {Component,inject} from '@angular/core'; import {AsyncPipe,NgFor,NgIf} from '@angular/common'; import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router'; import {AuthService} from './services/auth.service'; import {EquipoStateService} from './services/equipo-state.service';
@Component({selector:'app-root',standalone:true,imports:[AsyncPipe,NgFor,NgIf,RouterLink,RouterLinkActive,RouterOutlet],template:`
<div class="app-frame" [class.authenticated-shell]="auth.estaAutenticado()">
	<header class="topbar" *ngIf="auth.estaAutenticado()">
		<label class="team-switcher" *ngIf="equipoState.activo$ | async as activo"><span class="team-mark">⚽</span><select [value]="activo.id" (change)="equipoState.seleccionar($any($event.target).value)" aria-label="Equipo activo"><option *ngFor="let equipo of equipoState.equipos$ | async" [value]="equipo.id">{{equipo.nombre}}</option></select><span class="team-chevron">⌄</span></label>
		<div class="topbar-actions"><button class="icon-button" type="button" aria-label="Ajustes">⚙</button><button class="profile-avatar" type="button" (click)="auth.logout()" aria-label="Cerrar sesión">{{iniciales}}</button></div>
	</header>
	<main class="app-content"><router-outlet/></main>
	<nav class="bottom-tabs" *ngIf="auth.estaAutenticado()" aria-label="Navegación principal">
		<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"><span aria-hidden="true">⌂</span><small>Inicio</small></a>
		<a routerLink="/plantilla" routerLinkActive="active"><span aria-hidden="true">◈</span><small>Mi equipo</small></a>
		<a routerLink="/ranking" routerLinkActive="active"><span aria-hidden="true">♛</span><small>Ranking</small></a>
		<a routerLink="/jornada" routerLinkActive="active"><span aria-hidden="true">✦</span><small>Jornada</small></a>
		<a routerLink="/jugadores" routerLinkActive="active"><span aria-hidden="true">◎</span><small>Jugadores</small></a>
	</nav>
</div>`}) export class AppComponent{auth=inject(AuthService); equipoState=inject(EquipoStateService); constructor(){this.equipoState.cargar();} get iniciales(){const nombre=this.auth.usuario()?.nombre||'LM'; return nombre.split(' ').map(parte=>parte[0]).join('').slice(0,2).toUpperCase();}}
