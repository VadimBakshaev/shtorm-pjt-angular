import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LayoutComponent } from './shared/layout-component/layout-component';
import { HeaderComponent } from './shared/layout-component/header-component/header-component';
import { FooterComponent } from './shared/layout-component/footer-component/footer-component';
import { MainComponent } from './views/main-component/main-component';
import { SharedModule } from './shared/shared-module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth-interceptor';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  declarations: [
    App,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,    
  ],
  imports: [
    BrowserModule,
    SharedModule,
    MatSnackBarModule,
    MatMenuModule,
    DialogModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 500}},
    provideHttpClient(withInterceptorsFromDi()), 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }    
  ],
  bootstrap: [App]
})
export class AppModule { }
