import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../../types/default-response.type';
import { LoginResponseType } from '../../../types/login-response.type';
import { UserInfoType } from '../../../types/user-info.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  public readonly accessTokenKey: string = 'accessToken';
  public readonly refreshTokenKey: string = 'refreshToken';
  public readonly userIdKey: string = 'userId';
  public readonly userNameKey: string = 'userName';
  public readonly userEmailKey: string = 'userEmail';

  //private isLogged: boolean = false;
  //private userInfoState = new BehaviorSubject<UserInfoType | null>(null);
  private isLoggedS = signal<boolean>(false);
  private userInfoStateS = signal<UserInfoType | null>(null);

  public readonly isLogged = this.isLoggedS.asReadonly();
  public readonly userInfoState = this.userInfoStateS.asReadonly();

  // public isLogged$ = new BehaviorSubject<boolean>(false);
  // public userInfoState$ = this.userInfoState.asObservable();

  constructor() {
    this.isLoggedS.set(!!localStorage.getItem(this.accessTokenKey));
    // this.isLogged = !!localStorage.getItem(this.accessTokenKey);
    // this.isLogged$.next(this.isLogged);
    //if (this.isLogged) this.userInfoState.next(this.getUserInfo());
    if (this.isLoggedS()) this.userInfoStateS.set(this.getUserInfo());
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    })
  }

  public signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password
    })
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    this.removeTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', { refreshToken: tokens.refreshToken })
    }
    throw throwError(() => 'Can not find token');
  }

  public getIsLoggedIn(): boolean {
    return this.isLoggedS();
  }

  public setTokens(tokens: LoginResponseType): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    localStorage.setItem(this.userIdKey, tokens.userId);
    // this.isLogged = true;
    // this.isLogged$.next(true);
    this.isLoggedS.set(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    // this.isLogged = false;
    // this.isLogged$.next(false);
    this.isLoggedS.set(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  public refreshTokens(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not use token');
  }

  public getUser(): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users')
  }

  public setUserInfo(data: UserInfoType): void {
    localStorage.setItem(this.userNameKey, data.name);
    localStorage.setItem(this.userEmailKey, data.email);
    //this.userInfoState.next(data);
    this.userInfoStateS.set(data);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.userEmailKey);
    //this.userInfoState.next(null);
    this.userInfoStateS.set(null)
  }

  public getUserInfo(): UserInfoType {
    return {
      id: localStorage.getItem(this.userIdKey) ?? '',
      name: localStorage.getItem(this.userNameKey) ?? '',
      email: localStorage.getItem(this.userEmailKey) ?? ''
    }
  }

  public get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }
}
