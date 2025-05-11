import { inject, Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient, User } from '@supabase/supabase-js';
import { token, urlSupaBase } from '../../helper/consts';
import { Router } from '@angular/router';
import { IMensaje } from '../../types/mensaje';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  supabase: SupabaseClient<any, "public", any>;
  user = signal<User | null>(null);
  router = inject(Router);
  canal: RealtimeChannel;

  constructor() {
    this.supabase = createClient(urlSupaBase, token);

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user !== null) {
          this.user.set(session!.user);
          this.router.navigateByUrl("/home");
        }
      } else if (event === 'SIGNED_OUT') {
        this.user.set(null);
        this.router.navigateByUrl("/login");
      }
    })
    this.canal = this.supabase.channel('schema-db-changes');
  }

  async crearCuenta(email: string, password: string, name: string, surname: string, age: number) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });

    await this.supabase
      .from('personas')
      .insert({
        nombre: name,
        apellido: surname,
        edad: age,
        email: email
      });

    return { data, error };
  }

  async iniciarSesion(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error };
  }

  async getInfo() {

    const currentUser = this.user();
    if (!currentUser?.email) {
      throw new Error('Error no auth user');
    }
    let query = this.supabase
      .from('personas')
      .select(`
        id, 
        nombre, 
        apellido, 
        edad
      `);
    query = query.eq('email', currentUser!.email);
    const { data, error } = await query;
    if (error) {
      throw new Error('Error fetching data');
    }
    return data ? data[0] : null;
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error('Error signing out');
    }
  }

  async crearMensaje(mensaje: string, email: string) {

    await this.supabase
      .from('chat')
      .insert({ mensaje: mensaje, email_usuario: email });
  }

  async traerMensajes() {
    const { data } = await this.supabase
      .from('chat')
      .select(`
      id, 
      created_at,
      mensaje,
      personas (id, nombre, apellido, edad, email)
    `); 

    return data as unknown as IMensaje[] || null;
  }

}
