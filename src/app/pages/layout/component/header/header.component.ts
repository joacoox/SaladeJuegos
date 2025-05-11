import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { IPersona } from '../../../../types/persona';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  auth = inject(AuthService);
  dialog = inject(MatDialog);
  router = inject(Router);

  openUserModal() {
    this.dialog.open(UserModalComponent, {
      data: { email: this.auth.user()?.email }
    });
  }
  
  goTo(path: string) {
    this.router.navigateByUrl(path);
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-user.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent implements OnInit{

  auth = inject(AuthService);
  userSignal = signal<IPersona | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    let data = await this.auth.getInfo();
    this.userSignal.set(data as unknown as IPersona);
  }
  


}