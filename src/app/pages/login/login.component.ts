import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule,SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  formulario: FormGroup;
  flagError = signal<boolean>(false);
  isLoading = signal<boolean>(false);
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

  async login() {
    this.isLoading.set(true);
    if (!this.ValidateFields()) {
      this.isLoading.set(false);
      return;
    }
    try {
      const response = await this.auth.iniciarSesion(this.formulario.value.email, this.formulario.value.password);
      this.HandleError(response.error);
    } catch (error) {
      this.flagError.set(true);
      this.msjError = "Error al iniciar sesion";
    } finally {
      this.isLoading.set(false);
    }
  }
  HandleError(error: any) {
    if (error === null) return;
    this.flagError.set(true);
    switch (error.error.message) {
      case "Invalid login credentials":
        this.msjError = "No se encontro una cuenta con ese email y contraseña";
      break;
      default:
        this.msjError = "Error al iniciar sesion";
        break;
    }
  }
  ValidateFields(): boolean {
    if (this.email?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "El email es obligatorio";
      return false;
    }

    if (this.email?.invalid) {
      this.flagError.set(true);
      this.msjError = "El email no es valido";
      return false;
    }

    if (this.password?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "La contraseña es obligatoria";
      return false;
    }
    this.flagError.set(false);
    this.msjError = "";
    return true;
  }

  get email() {
    return this.formulario.get('email');
  }
  get password() {
    return this.formulario.get('password');
  }

  async AutoLogin() {
    try {
      await this.auth.iniciarSesion("joaquinarieldominguez@gmail.com", "123123");
    } catch (error) {
      this.flagError.set(true);
      this.msjError = "Error al iniciar sesion";
    }
  }
}
