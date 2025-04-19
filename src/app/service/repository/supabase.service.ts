import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { token, urlSupaBase } from '../../helper/consts';
import { IPersona } from '../../types/persona';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient<any, "public", any>;
  tablaPersonas: PostgrestQueryBuilder<any, any, "personas", unknown>;

  constructor() {
    this.supabase = createClient(urlSupaBase, token);
    this.tablaPersonas = this.supabase.from("personas");
  }

  async crearPersonas(...personas: Array<IPersona>) {
    const { data, error } = await this.tablaPersonas.insert(personas);
    console.log(data);
    console.log(error);
  }

}
