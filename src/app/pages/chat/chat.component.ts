import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
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
export class ChatComponent {
  @ViewChild('chatWindow') private chatWindowRef!: ElementRef;
  private shouldScroll = true;
  supabase = inject(AuthService);
  chats = signal<IMensaje[]>([]);
  auth = inject(AuthService);
  message: string = "";
  private mensajesCargados = new Set<number>();
  private userColors = new Map<string, string>();

  constructor() {
    this.cargarMensajesIniciales();
    this.configurarSuscripcionTiempoReal();
  }

  private async cargarMensajesIniciales() {
    try {
      const response = await this.supabase.traerMensajes();
      if (response) {
        this.chats.set(response);
        response.forEach(m => this.mensajesCargados.add(m.id!));
        this.scrollToBottom();
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  }

  private configurarSuscripcionTiempoReal() {
    this.supabase.supabase
      .channel('chat-cambios')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
        },
        async () => {
          const nuevosMensajes = await this.supabase.traerMensajes();
          if (nuevosMensajes) {
            const mensajesFiltrados = nuevosMensajes.filter(
              m => !this.mensajesCargados.has(m.id!)
            );
            mensajesFiltrados.forEach(m => this.mensajesCargados.add(m.id!));
            this.chats.update(current => [...current, ...mensajesFiltrados]);
            this.scrollToBottom();
          }
        }
      )
      .subscribe();
  }

  private scrollToBottom(): void {
    if (!this.shouldScroll) return;
    
    setTimeout(() => {
      try {
        const element = this.chatWindowRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        console.error('Error al hacer scroll:', err);
      }
    });
  }

  EnviarMensaje() {
    const currentUser = this.auth.user();
    if (this.message && currentUser?.email) {
      this.shouldScroll = true;
      this.supabase.crearMensaje(this.message, currentUser!.email);
      this.message = '';
    }
  }

  isCurrentUser(email?: string): boolean {
    const currentUser = this.auth.user();
    if (!email || !currentUser?.email) return false;
    return email === currentUser?.email;
  }

  getUserColor(email: string): string {
    if (!this.userColors.has(email)) {
      const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      this.userColors.set(email, `hsl(${hue}, 70%, 85%)`);
    }
    return this.userColors.get(email)!;
  }

  onChatScroll() {
    const element = this.chatWindowRef.nativeElement;
    const tolerance = 100;
    this.shouldScroll = 
      (element.scrollHeight - element.scrollTop - element.clientHeight) < tolerance;
  }
}
