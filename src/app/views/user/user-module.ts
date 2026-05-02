import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { LoginComponent } from './login-component/login-component';
import { SignupComponent } from './signup-component/signup-component';
import { FormField } from '@angular/forms/signals';
import { SharedModule } from "../../shared/shared-module";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormField,
    UserRoutingModule,
    SharedModule
]
})
export class UserModule { }
