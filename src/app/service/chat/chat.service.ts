import { Injectable } from '@angular/core';
import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import { token, urlSupaBase } from '../../helper/consts';
import { IMensaje } from '../../types/mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  supabase;
  canal: RealtimeChannel;

  constructor() {
    this.supabase = createClient(urlSupaBase, token);
    this.canal = this.supabase.channel('schema-db-changes');
  }

  async crear(mensaje: string, id_usuario: number) {

    await this.supabase
      .from('chat')
      .insert({ mensaje: mensaje, id_usuario: id_usuario });
  }

  async traer() {
    const { data } = await this.supabase
      .from('chat')
      .select(`
      id, 
      mensaje, 
      created_at, 
      id_usuario,
      personas!inner(id, nombre, apellido, edad)
    `); 

    return data as unknown as IMensaje[] || null;
  }
}
