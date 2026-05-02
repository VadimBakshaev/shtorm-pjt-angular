import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerCarouselComponent } from './components/carousel-component/carousel-component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReviewsCarouselComponent } from './components/reviews-carousel-component/reviews-carousel-component';
import { CategoriesBadgetComponent } from './components/categories-badget-component/categories-badget-component';
import { ModalDialogComponent } from './components/modal-dialog-component/modal-dialog-component';
import { FormField } from "@angular/forms/signals";
import { CommentComponent } from './components/comment-component/comment-component';
import { ShowPassComponent } from './components/show-pass-component/show-pass-component';
import { ModalComponent } from './components/modal-component/modal-component';


@NgModule({
  declarations: [
    BannerCarouselComponent,
    ReviewsCarouselComponent,
    CategoriesBadgetComponent,
    ModalDialogComponent,
    CommentComponent,
    ShowPassComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    FormField
],
  exports: [
    BannerCarouselComponent,
    ReviewsCarouselComponent,
    CategoriesBadgetComponent,
    ModalDialogComponent,
    CommentComponent,
    ShowPassComponent
  ]
})
export class SharedModule { }
