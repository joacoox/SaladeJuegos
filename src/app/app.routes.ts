import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './guards/auth/auth.guard';
import { userActiveGuard } from './guards/userActive/user-active.guard';

export const routes: Routes = [
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
            {
                path: 'sobre-mi',
                loadComponent: () => import("./pages/sobre-mi/sobre-mi.component").then((c) => c.SobreMiComponent)
            },
            {
                path: "bienvenida",
                loadComponent: () => import("./pages/bienvenida/bienvenida.component").then((c) => c.BienvenidaComponent),
                canActivateChild: [authGuard],
                children: [
                    {
                        path: "ahorcado",
                        loadComponent: () => import("./juegos/ahorcado/ahorcado.component").then((c) => c.AhorcadoComponent)
                    },
                    {
                        path: "preguntados",
                        loadComponent: () => import("./juegos/preguntados/preguntados.component").then((c) => c.PreguntadosComponent)
                    },
                    {
                        path: "mayor-menor",
                        loadComponent: () => import("./juegos/mayor-menor/mayor-menor.component").then((c) => c.MayorMenorComponent)
                    },
                    {
                        path: "sudoku",
                        loadComponent: () => import("./juegos/sudoku/sudoku.component").then((c) => c.SudokuComponent)
                    }
                ]
            },
        ]
    },
    {
        path: "login",
        loadComponent: () => import("./pages/login/login.component").then((c) => c.LoginComponent),
        canActivateChild: [userActiveGuard]
    },
    {
        path: "registro",
        loadComponent: () => import("./pages/registro/registro.component").then((c) => c.RegistroComponent),
        canActivateChild: [userActiveGuard]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
