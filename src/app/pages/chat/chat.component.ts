import { Component, inject, signal } from '@angular/core';
import { IMensaje } from '../../types/mensaje';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [DatePipe, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent{

  supabase = inject(AuthService);
  chats = signal<IMensaje[]>([]);
  auth = inject(AuthService);
  message: string = "";

  constructor() {
    try {
      this.supabase.traerMensajes().then((response) => {
        if (response !== null) {
          this.chats.set([...response]);
        }
      })

      const subscripcion = this.supabase.canal.on("postgres_changes", {
        event: "INSERT", schema: 'public', table: 'chat',
      }, (payload) => {
        console.log("hola")
        const array: IMensaje[] = this.chats();
        array.push(payload.new as IMensaje);
        this.chats.set([...array]);

        subscripcion.subscribe();
      });
    } catch (ex) {
      console.log(ex)
    }
  }

  EnviarMensaje() {
    const currentUser = this.auth.user();

    if (this.message && currentUser?.email) {
      this.supabase.crearMensaje(this.message, currentUser!.email);
      this.message = '';
    }
  }

  isCurrentUser(email?: string): boolean {
    const currentUser = this.auth.user();
    if (!email || !currentUser?.email) return false;
    return email === currentUser?.email;
  }
}
