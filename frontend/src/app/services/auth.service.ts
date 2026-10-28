import {Injectable,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';

export interface Usuario {id:string;nombre:string;email:string;administrador:boolean;avatarUrl?:string;}

@Injectable({providedIn:'root'})
export class AuthService {
  private http=inject(HttpClient);
  private router=inject(Router);
  private base='http://localhost:8080/api';
  usuario():Usuario|null { const raw=localStorage.getItem('liga_usuario'); return raw?JSON.parse(raw):null; }
  estaAutenticado(){return this.usuario()!==null;}
  login(email:string,password:string){return this.http.post<Usuario>(this.base+'/auth/login',{email,password}).pipe(tap(usuario=>localStorage.setItem('liga_usuario',JSON.stringify(usuario))));}
  logout(){localStorage.removeItem('liga_usuario');this.router.navigateByUrl('/login');}
}
