import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing-module';
import { BlogComponent } from './blog-component/blog-component';
import { SharedModule } from "../../shared/shared-module";
import { ArticleComponent } from './article-component/article-component';
import { FormField } from '@angular/forms/signals';


@NgModule({
  declarations: [BlogComponent, ArticleComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    FormField,
    SharedModule
]
})
export class BlogModule { }
