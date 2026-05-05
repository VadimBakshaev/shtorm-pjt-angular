import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ModalDialogComponent } from '../modal-dialog-component/modal-dialog-component';

@Component({
  selector: 'banner-carousel-component',
  standalone: false,
  templateUrl: './carousel-component.html',
  styleUrl: './carousel-component.scss',
})
export class BannerCarouselComponent {
  private readonly dialog = inject(Dialog);

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
      description: '',
      url: 'target'
    },
    {
      id: 'banner 2',
      img: 'banner2.jpg',
      type: 'Акция',
      title: '<span class="accent">Нужен грамотный</span> копирайтер<span class="accent">?</span>',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      url: 'kopiraiting'
    },
    {
      id: 'banner 3',
      img: 'banner3.jpg',
      type: 'Новость дня',
      title: '6 место <span class="accent">в ТОП-10 SMM-агенств Москвы!</span>',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      url: 'smm'
    },
  ]

  protected openDialog(url: string): void {
    this.dialog.open(ModalDialogComponent, {
      data: { type: 'order', service: url }
    })
  }
}
