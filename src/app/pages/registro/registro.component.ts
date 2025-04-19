import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  auth = inject(AuthService);
  router = inject(Router);
  formulario: FormGroup;
  flagError: boolean = false;
  msjError: string = "";
  minLength: number = 6;
  maxLength: number = 13;

  constructor() {
    this.formulario = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      repeatPassword: new FormControl("", [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]),
      password: new FormControl("", [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)])
    });
  }

  registrar() {
    if (!this.ValidateFields()) return;

    try {
      this.auth.crearCuenta(this.formulario.value.email, this.formulario.value.password);
    } catch (error) {
      this.flagError = true;
      this.msjError = "Error al crear la cuenta";
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

    if (this.password?.hasError("required") && this.repeatPassword?.hasError("required")) {
      this.flagError = true;
      this.msjError = "La contraseña es obligatoria";
      return false;
    }

    if (this.password?.hasError("minlength") && this.repeatPassword?.hasError("minlength")) {
      this.flagError = true;
      this.msjError = "La contraseña debe tener al menos " + this.minLength + " caracteres";
      return false;
    }

    if (this.password?.hasError("maxlength") && this.repeatPassword?.hasError("maxlength")) {
      this.flagError = true;
      this.msjError = "La contraseña debe tener como maximo " + this.maxLength + " caracteres";
      return false;
    }

    if (this.password?.value !== this.repeatPassword?.value) {
      this.flagError = true;
      this.msjError = "Las contraseñas no coinciden";
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
  get repeatPassword() {
    return this.formulario.get('repeatPassword');
  }

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
