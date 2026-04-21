import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth-service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  protected isLogged = toSignal(this.authService.isLogged$, { initialValue: false });
  protected userName = toSignal(this.authService.userInfoState$, { initialValue: null });

  protected logout(): void {
    this.authService.logout().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.doLogout())
    ).subscribe()
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this.snackBar.open('Вы вышли из системы');
  }

}
