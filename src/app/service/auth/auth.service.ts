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
      `)
      .order('created_at', { ascending: true });

    return (data as unknown as IMensaje[]) || null;
  }

  async subirScoreMayorOMenor(score: number) {
    const { data } = await this.supabase
      .from('scoreMayorMenor')
      .select(`
        id, 
        scored_at,
        email_usuario,
        mejor_puntaje
      `)
      .eq("email_usuario", this.user()?.email)
      .limit(1);

    if (!data || data.length === 0) {
      await this.supabase
        .from('scoreMayorMenor')
        .insert({
          email_usuario: this.user()?.email,
          mejor_puntaje: score,
          scored_at: new Date().toISOString()
        });
    } else {
      const currentScore = data[0].mejor_puntaje;
      if (currentScore === null || score > currentScore) {
        await this.supabase
          .from('scoreMayorMenor')
          .update({
            mejor_puntaje: score,
            scored_at: new Date().toISOString()
          })
          .eq('email_usuario', this.user()?.email);
      }
    }
  }

  async subirScorePreguntados(score: number) {
    const { data } = await this.supabase
      .from('scorePreguntados')
      .select(`
        id, 
        scored_at,
        email_usuario,
        mejor_puntaje
      `)
      .eq("email_usuario", this.user()?.email)
      .limit(1);

    if (!data || data.length === 0) {
      await this.supabase
        .from('scorePreguntados')
        .insert({
          email_usuario: this.user()?.email,
          mejor_puntaje: score,
          scored_at: new Date().toISOString()
        });
    } else {
      const currentScore = data[0].mejor_puntaje;
      if (currentScore === null || score > currentScore) {
        await this.supabase
          .from('scorePreguntados')
          .update({
            mejor_puntaje: score,
            scored_at: new Date().toISOString()
          })
          .eq('email_usuario', this.user()?.email);
      }
    }
  }

  async subirScoreAhorcado(score: number) {
    const { data } = await this.supabase
      .from('scoreAhorcado')
      .select(`
        id, 
        scored_at,
        email_usuario,
        mejor_puntaje
      `)
      .eq("email_usuario", this.user()?.email)
      .limit(1);

    if (!data || data.length === 0) {
      await this.supabase
        .from('scoreAhorcado')
        .insert({
          email_usuario: this.user()?.email,
          mejor_puntaje: score,
          scored_at: new Date().toISOString()
        });
    } else {
      const currentScore = data[0].mejor_puntaje;
      if (currentScore === null || score > currentScore) {
        await this.supabase
          .from('scoreAhorcado')
          .update({
            mejor_puntaje: score,
            scored_at: new Date().toISOString()
          })
          .eq('email_usuario', this.user()?.email);
      }
    }
  }

  async subirScoreSudoku(score: number, timeToFinish : string) {
    const { data } = await this.supabase
      .from('scoreSudoku')
      .select(`
        id, 
        scored_at,
        email_usuario,
        mejor_puntaje,
        time_to_finish
      `)
      .eq("email_usuario", this.user()?.email)
      .limit(1);

    if (!data || data.length === 0) {
      await this.supabase
        .from('scoreSudoku')
        .insert({
          email_usuario: this.user()?.email,
          mejor_puntaje: score,
          scored_at: new Date().toISOString()
        });
    } else {
      const currentScore = data[0].mejor_puntaje;
      if (currentScore === null || score > currentScore) {
        await this.supabase
          .from('scoreSudoku')
          .update({
            mejor_puntaje: score,
            scored_at: new Date().toISOString()
          })
          .eq('email_usuario', this.user()?.email);
      }
    }
  }
}
