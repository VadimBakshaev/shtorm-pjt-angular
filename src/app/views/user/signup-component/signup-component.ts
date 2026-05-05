import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth-service';
import { form, required, email, pattern, minLength } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetectResponseUtilite } from '../../../shared/utils/detect-response-utilite';
import { HttpErrorResponse } from '@angular/common/http';
import { UserInfoType } from '../../../../types/user-info.type';
import { Dialog } from '@angular/cdk/dialog';
import { ModalComponent } from '../../../shared/components/modal-component/modal-component';

interface SignupType {
  name: string;
  email: string;
  password: string;
  confirm: boolean;
}

@Component({
  selector: 'app-signup-component',
  standalone: false,
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.scss',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly modal = inject(Dialog);

  private signupModel = signal<SignupType>({
    name: '',
    email: '',
    password: '',
    confirm: false
  });

  protected hidePass = signal<boolean>(true);

  protected signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Введите Ваше имя' });
    pattern(schemaPath.name, /^[А-ЯЁ][а-яё]*(?:\s+[А-ЯЁ][а-яё]*)*$/u,
      { message: 'Имя может содержать русские буквы и пробелы и каждое новое слово - с большой буквы' });
    required(schemaPath.email, { message: 'Заполните поле Email' });
    email(schemaPath.email, { message: 'Пожалуйста введите корректный Email' });
    required(schemaPath.password, { message: 'Заполните поле пароля' });
    pattern(schemaPath.password, /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]*$/,
      { message: 'Пароль должен содержать как минимум 1 букву в верхнем регистре и как минимум 1 цифру' });
    minLength(schemaPath.password, 8, { message: 'Длинна пароля не менее 8-ми символов' });
    required(schemaPath.confirm);
  });

  protected signup(): void {
    console.log(this.signupForm().value());
    if (!this.signupForm().valid()) return;
    this.authService.signup(
      this.signupForm().value().name,
      this.signupForm().value().email,
      this.signupForm().value().password
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          this.snackBar.open('Ошибка авторизации');
          throw new Error(data.message);
        } else {
          this.authService.setTokens(data);
          this.snackBar.open('Вы успешно зарегистрировались');
          this.setUser(data.userId);
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this.snackBar.open(errorResponse.error.message);
        } else {
          this.snackBar.open('Ошибка авторизации');
        }
      }
    });
  }

  private setUser(id: string): void {
    const user: UserInfoType = {
      id,
      name: this.signupForm().value().name,
      email: this.signupForm().value().email
    };
    this.authService.setUserInfo(user);
    this.router.navigate(['/']);
  }

  protected openModal(type: string): void {
    this.modal.open(ModalComponent, { data: { type } });
  }
}
