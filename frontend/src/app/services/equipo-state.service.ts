import {Injectable, inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Equipo, LigaApi} from './liga-api.service';

@Injectable({providedIn: 'root'})
export class EquipoStateService {
  private api = inject(LigaApi);
  private equiposSubject = new BehaviorSubject<Equipo[]>([]);
  private activoSubject = new BehaviorSubject<Equipo|null>(null);

  readonly equipos$ = this.equiposSubject.asObservable();
  readonly activo$ = this.activoSubject.asObservable();

  get activo() { return this.activoSubject.value; }

  cargar() {
    if (this.equiposSubject.value.length) return;
    this.api.equipos().subscribe(equipos => {
      this.equiposSubject.next(equipos);
      const guardado = localStorage.getItem('liga_equipo_activo');
      const activo = equipos.find(equipo => equipo.id === guardado) || equipos[0] || null;
      this.activoSubject.next(activo);
    });
  }

  seleccionar(id: string) {
    const equipo = this.equiposSubject.value.find(item => item.id === id);
    if (equipo) {
      this.activoSubject.next(equipo);
      localStorage.setItem('liga_equipo_activo', equipo.id);
    }
  }

  agregar(equipo: Equipo) {
    this.equiposSubject.next([...this.equiposSubject.value, equipo]);
    this.seleccionar(equipo.id);
  }
}
