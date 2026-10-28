import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface Jugador {id: string; apodo: string; posicionPrincipal: string; posicionSecundaria?: string; valorMercadoActual: number; mediaPuntos: number; variacionUltimaJornada: number;}
export interface Equipo {id: string; nombre: string; formato: string; tamanoAlineacion?: number; presupuestoMaximo: number; colorHex: string; codigoInvitacion?: string; metodoPreciosIni: string; encuestaPreciosAbierta: boolean;}
export interface EstadoJugador {jugador: Jugador; asistencia: 'SIN_CONFIRMAR'|'SIN_CONTESTAR'|'JUEGA'|'NO_JUEGA'; historial: {valorMercado: number; fechaRegistro: string}[]; miembroId: string; jugadorMiembroId?: string;}
export interface RankingItem {miembroId: string; nombre: string; avatar?: string; puntosTotales: number; puesto: number; esUsuarioActual: boolean; variacionPuestos: number;}

@Injectable({providedIn: 'root'})
export class LigaApi {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';
  private options() { const id = JSON.parse(localStorage.getItem('liga_usuario') || 'null')?.id; return {headers: new HttpHeaders({'X-User-Id': id || ''})}; }
  equipos() { return this.http.get<Equipo[]>(this.base + '/equipos', this.options()); }
  crearEquipo(equipo: Partial<Equipo>, esJugadorReal: boolean) { return this.http.post<Equipo>(this.base + '/equipos', {equipo, esJugadorReal}, this.options()); }
  plantilla(id: string) { return this.http.get<Jugador[]>(`${this.base}/equipos/${id}/plantilla`, this.options()); }
  crearJugador(id: string, jugador: Partial<Jugador>) { return this.http.post<Jugador>(`${this.base}/equipos/${id}/plantilla`, jugador, this.options()); }
  dashboard(id: string) { return this.http.get<any>(`${this.base}/equipos/${id}/dashboard`, this.options()); }
  partidos(id: string) { return this.http.get<any[]>(`${this.base}/equipos/${id}/partidos`, this.options()); }
  crearPartido(id: string, partido: any) { return this.http.post<any>(`${this.base}/equipos/${id}/partidos`, partido, this.options()); }
  estadoPartido(id: string) { return this.http.get<EstadoJugador[]>(`${this.base}/partidos/${id}/estado`, this.options()); }
  actualizarAsistencia(partidoId: string, jugadorId: string, estado: 'JUEGA'|'NO_JUEGA') { return this.http.post<any>(`${this.base}/partidos/${partidoId}/jugadores/${jugadorId}/asistencia`, null, {...this.options(), params: {estado}}); }
  guardarAlineacion(id: string, miembroId: string, formacion: string, detalles: any[]) { return this.http.post<any>(`${this.base}/partidos/${id}/alineacion`, {formacion, detalles}, this.options()); }
  ranking(id: string) { return this.http.get<RankingItem[]>(`${this.base}/equipos/${id}/ranking`, this.options()); }
  cerrarJornada(partidoId: string) { return this.http.post<any>(`${this.base}/partidos/${partidoId}/cerrar-jornada`, null, this.options()); }
  votar(voto: any) { return this.http.post<any>(this.base + '/votos', voto, this.options()); }
  cambiarEncuesta(id: string, abierta: boolean) { return this.http.post<Equipo>(`${this.base}/equipos/${id}/precios/encuesta`, null, {...this.options(), params: {abierta}}); }
  proponerPrecio(equipoId: string, jugadorId: string, valor: number) { return this.http.post<any>(`${this.base}/equipos/${equipoId}/jugadores/${jugadorId}/precio`, {valor}, this.options()); }
}
