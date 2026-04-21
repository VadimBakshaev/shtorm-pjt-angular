import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'banner-carousel-component',
  standalone: false,
  templateUrl: './carousel-component.html',
  styleUrl: './carousel-component.scss',
})
export class BannerCarouselComponent {
  protected options: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,    
  }

  protected banners = [
    {
      id: 'banner 1',
      img: 'banner1.jpg',
      type: 'Предложение месяца',
      title: '<span class="accent">Продвижение в Instagram для вашего бизнеса</span> -15%<span class="accent">!</span>',
      description: ''
    },
    {
      id: 'banner 2',
      img: 'banner2.jpg',
      type: 'Акция',
      title: '<span class="accent">Нужен грамотный</span> копирайтер<span class="accent">?</span>',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.'
    },
    {
      id: 'banner 3',
      img: 'banner3.jpg',
      type: 'Новость дня',
      title: '6 место <span class="accent">в ТОП-10 SMM-агенств Москвы!</span>',
      description: 'Мы благодарим каждого, кто голосовал за нас!'
    },
  ]
}
