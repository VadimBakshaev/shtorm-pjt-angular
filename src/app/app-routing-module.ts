import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout-component/layout-component';
import { MainComponent } from './views/main-component/main-component';
import { authForwardGuard } from './core/auth/auth-forward-guard';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: '', loadChildren: () => import('./views/user/user-module').then(m => m.UserModule), canActivate: [authForwardGuard] },
      { path: '', loadChildren: () => import('./views/blog/blog-module').then(m => m.BlogModule) },
    ]
  }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',  
  scrollOffset: [0, 60],       
  onSameUrlNavigation: 'reload' 
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
