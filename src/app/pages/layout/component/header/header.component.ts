import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { AuthService } from '../../../../service/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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

  openUserModal() {
    this.dialog.open(UserModalComponent, {
      data: { email: this.auth.user()?.email }
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-user.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent {
  auth = inject(AuthService);
}