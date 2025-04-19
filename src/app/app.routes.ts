import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { SobreMiComponent } from './pages/sobre-mi/sobre-mi.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "registro", component: RegistroComponent },
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            { path: 'sobre-mi', component: SobreMiComponent },
            { path: "bienvenida", component: BienvenidaComponent },
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
