import { Component, inject, signal } from '@angular/core';
import { IMensaje } from '../../types/mensaje';
import { ChatService } from '../../service/chat/chat.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-chat',
  imports: [DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  supabase = inject(ChatService);
  chats = signal<IMensaje[]>([]);
  auth = inject(AuthService);
  
  constructor(){
    this.supabase.traer().then((response) => {
      if(response !== null) {
        this.chats.set([...response]);
      }
    })

    const subscripcion = this.supabase.canal.on("postgres_changes", { event: "INSERT", schema: 'public', table: 'chat',
    }, (payload) => {
      const array: IMensaje[] = this.chats();
      array.push(payload.new as IMensaje);
      this.chats.set([...array]);
    });

    subscripcion.subscribe();
  }

  EnviarMensaje() {
    const input = document.getElementById('message-input') as HTMLInputElement;
    const mensaje = input.value;
    if (mensaje && this.auth.user()) {
      const userId = parseInt(this.auth.user()!.id);
      this.supabase.crear(mensaje, userId);
      input.value = '';
    }
  }

  isCurrentUser(userId: number | undefined): boolean {
    if (!userId || !this.auth.user()) return false;
    return userId === parseInt(this.auth.user()!.id);
  }
}
