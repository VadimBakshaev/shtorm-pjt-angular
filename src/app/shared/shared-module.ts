import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerCarouselComponent } from './components/carousel-component/carousel-component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReviewsCarouselComponent } from './components/reviews-carousel-component/reviews-carousel-component';
import { CategoriesBadgetComponent } from './components/categories-badget-component/categories-badget-component';
import { ModalDialogComponent } from './components/modal-dialog-component/modal-dialog-component';
import { FormField } from "@angular/forms/signals";


@NgModule({
  declarations: [
    BannerCarouselComponent,
    ReviewsCarouselComponent,
    CategoriesBadgetComponent,
    ModalDialogComponent
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
    ModalDialogComponent
  ]
})
export class SharedModule { }
