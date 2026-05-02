import { Component, DestroyRef, inject, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { AuthService } from '../../../core/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetectResponseUtilite } from '../../../shared/utils/detect-response-utilite';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginType {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  private loginModel = signal<LoginType>({
    email: '',
    password: '',
    rememberMe: false
  });

  protected hide = signal<boolean>(true);

  protected loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Заполните поле Email' });
    required(schemaPath.password, { message: 'Заполните поле пароля' });
    email(schemaPath.email, { message: 'Пожалуйста введите корректный Email' });
  });

  protected login() {
    if (!this.loginForm().valid()) return;
    this.authService.login(
      this.loginForm().value().email,
      this.loginForm().value().password,
      this.loginForm().value().rememberMe
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          this.snackBar.open('Ошибка авторизации');
          throw new Error(data.message);
        } else {
          this.authService.setTokens(data);
          this.snackBar.open('Вы успешно авторизовались');
          return this.setUser();          
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this.snackBar.open(errorResponse.error.message);
        } else {
          this.snackBar.open('Ошибка авторизации');
        }
      }
    })

  }

  private setUser() {
    this.authService.getUser().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          this.snackBar.open('Ошибка при получении данных пользователя');
          throw new Error(data.message);
        } else {
          this.authService.setUserInfo(data);
          this.router.navigate(['/']);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          console.error(errorResponse.error.message);
        } else {
          this.snackBar.open('Ошибка при получении данных пользователя');
        }
      }
    })
  }

}
