import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError, finalize, switchMap } from "rxjs";
import { DefaultResponseType } from "../../../types/default-response.type";
import { LoginResponseType } from "../../../types/login-response.type";
import { AuthService } from "./auth-service";
import { DetectResponseUtilite } from "../../shared/utils/detect-response-utilite";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    //private readonly loaderService = inject(LoaderService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //this.loaderService.show();
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accessToken) {
            const authReq = req.clone({
                headers: req.headers.set('x-auth', tokens.accessToken)
            });
            return next.handle(authReq)
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                            return this.handle401Error(authReq, next);
                        };
                        return throwError(() => error);
                    }),
                    finalize(() => { })//this.loaderService.hide())
                );
        };
        return next.handle(req).pipe(finalize(() => { }));//this.loaderService.hide()));
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refreshTokens().pipe(
            switchMap((result: DefaultResponseType | LoginResponseType) => {
                let error = '';
                if (DetectResponseUtilite.isErrorResponse(result)) {
                    error = result.message;
                } else {
                    const refreshResult = result;
                    if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
                        error = 'Ошибка авторизации';
                    } else {
                        this.authService.setTokens(result);
                        const authReq = req.clone({
                            headers: req.headers.set('x-auth', refreshResult.accessToken)
                        });
                        return next.handle(authReq);
                    }
                }
                if (error) return throwError(() => new Error(error));
                return next.handle(req);
            }),
            catchError(error => {
                this.authService.removeTokens();
                this.router.navigate(['/']);
                return throwError(() => error);
            })
        )
    }
}
