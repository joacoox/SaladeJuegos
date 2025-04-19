import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { token, urlSupaBase } from '../../helper/consts';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  supabase: SupabaseClient<any, "public", any>;
  user = signal<User | null>(null);
  router = inject(Router);
  constructor() {
    this.supabase = createClient(urlSupaBase, token);

    const { data } = this.supabase.auth.onAuthStateChange((event, session) => {   
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if(session?.user !== null){
          this.user.set(session!.user);
          this.router.navigateByUrl("/home");
        }
      } else if (event === 'SIGNED_OUT') {
        this.user.set(null);
        this.router.navigateByUrl("/login");
      } 
    })

   // data.subscription.unsubscribe();
  }

  async crearCuenta(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(error);
  }

  async iniciarSesion(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
  }

}
