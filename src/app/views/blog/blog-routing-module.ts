import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog-component/blog-component';
import { ArticleComponent } from './article-component/article-component';

const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  { path: 'article/:url', component: ArticleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
