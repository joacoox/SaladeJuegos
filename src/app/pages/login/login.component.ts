import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  formulario: FormGroup;
  flagError: boolean = false;
  msjError: string = "";
  

  constructor() {
    this.formulario = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    });
  }
  goTo(path: string) {
    this.router.navigateByUrl(path);
  }

  login() {
    if (!this.ValidateFields()) return;

    try {
      this.auth.iniciarSesion(this.formulario.value.email, this.formulario.value.password);
    } catch (error) {
      this.flagError = true;
      this.msjError = "Error al iniciar sesion";
    }
  }

  ValidateFields(): boolean {
    if (this.email?.hasError("required")) {
      this.flagError = true;
      this.msjError = "El email es obligatorio";
      return false;
    }

    if (this.email?.invalid) {
      this.flagError = true;
      this.msjError = "El email no es valido";
      return false;
    }

    if (this.password?.hasError("required")) {
      this.flagError = true;
      this.msjError = "La contraseña es obligatoria";
      return false;
    }
    this.flagError = false;
    this.msjError = "";
    return true;
  }

  get email() {
    return this.formulario.get('email');
  }
  get password() {
    return this.formulario.get('password');
  }

  AutoLogin() {
    try {
      this.auth.iniciarSesion("joaquinarieldominguez@gmail.com", "123456");
    } catch (error) {
      this.flagError = true;
      this.msjError = "Error al iniciar sesion";
    }
  }
}
