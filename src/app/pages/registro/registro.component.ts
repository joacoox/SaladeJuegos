import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  auth = inject(AuthService);
  router = inject(Router);
  formulario: FormGroup;
  flagError = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  msjError: string = "";
  minLength: number = 6;
  maxLength: number = 13;

  constructor() {
    this.formulario = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      name: new FormControl("", [Validators.required]),
      surname: new FormControl("", [Validators.required]),
      age: new FormControl(0, [Validators.required]),
      repeatPassword: new FormControl("", [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]),
      password: new FormControl("", [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)])
    });
  }

  async registrar() {
    this.isLoading.set(true);
    if (!this.ValidateFields()) {
      this.isLoading.set(false);
      return;
    }
    try {
      const response = await this.auth.crearCuenta(
        this.formulario.value.email, 
        this.formulario.value.password,
        this.formulario.value.name,
        this.formulario.value.surname,
        this.formulario.value.age
      );
      this.HandleError(response);
    } catch (error) {
      this.flagError.set(true);
      this.msjError = "Error al crear la cuenta";
    } finally {
      this.isLoading.set(false);
    }
  }

  HandleError(error: any) {
    if (error === null) return;
    this.flagError.set(true);

    switch (error.error.message) {
      case "User already registered":
        this.msjError = "Usuario ya registrado con ese email";
      break;
      default:
        this.msjError = "Error al crear la cuenta";
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

    if (this.name?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "El nombre es obligatorio";
      return false;
    }

    if (this.surname?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "El apellido es obligatorio";
      return false;
    }

    if (this.age?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "La edad es obligatoria";
      return false;
    }

    if (this.age?.value > 99) {
      this.flagError.set(true);
      this.msjError = "La edad debe ser menor a 99";
      return false;
    }

    if (this.password?.hasError("required") && this.repeatPassword?.hasError("required")) {
      this.flagError.set(true);
      this.msjError = "La contraseña es obligatoria";
      return false;
    }

    if (this.password?.hasError("minlength") && this.repeatPassword?.hasError("minlength")) {
      this.flagError.set(true);
      this.msjError = "La contraseña debe tener al menos " + this.minLength + " caracteres";
      return false;
    }

    if (this.password?.hasError("maxlength") && this.repeatPassword?.hasError("maxlength")) {
      this.flagError.set(true);
      this.msjError = "La contraseña debe tener como maximo " + this.maxLength + " caracteres";
      return false;
    }

    if (this.password?.value !== this.repeatPassword?.value) {
      this.flagError.set(true);
      this.msjError = "Las contraseñas no coinciden";
      return false;
    }
    this.flagError.set(false);
    this.msjError = "";
    return true;
  }

  get email() {
    return this.formulario.get('email');
  }
  get name() {
    return this.formulario.get('name');
  }
  get surname() {
    return this.formulario.get('surname');
  }
  get age() {
    return this.formulario.get('age');
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
