import {CommonModule} from '@angular/common'; import {Component,inject} from '@angular/core';
import {FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({selector:'app-login',standalone:true,imports:[CommonModule,ReactiveFormsModule],template:`
<section class="login-shell"><div class="login-panel"><p class="eyebrow">LIGA MUNICIPAL</p><h1>Bienvenido de nuevo</h1><p class="lead">Accede a tu espacio de gestión.</p>
<form [formGroup]="form" (ngSubmit)="entrar()"><label>Email<input type="email" formControlName="email" autocomplete="username"></label><label>Contraseña<input type="password" formControlName="password" autocomplete="current-password"></label><p class="error" *ngIf="error">{{error}}</p><button type="submit" [disabled]="form.invalid||cargando">{{cargando?'Entrando...':'Entrar'}}</button></form><small>Demo: admin&#64;ligamunicipal.local / admin123</small></div></section>`})
export class LoginComponent {
  private fb=inject(FormBuilder); private auth=inject(AuthService); private router=inject(Router);
  form=this.fb.nonNullable.group({email:['', [Validators.required,Validators.email]],password:['',Validators.required]});
  cargando=false; error='';
  entrar(){if(this.form.invalid)return; this.cargando=true; this.error=''; const {email,password}=this.form.getRawValue(); this.auth.login(email,password).subscribe({next:()=>this.router.navigateByUrl('/'),error:()=>{this.error='Email o contraseña incorrectos';this.cargando=false;}});}
}
