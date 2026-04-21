import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'reviews-carousel-component',
  standalone: false,
  templateUrl: './reviews-carousel-component.html',
  styleUrl: './reviews-carousel-component.scss',
})
export class ReviewsCarouselComponent {
  protected options: OwlOptions = {
    loop: true,
    margin: 25,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    nav: false,
  };

  protected reviews = [
    {
      avatar: 'avatar1.jpg',
      name: 'Станислав',
      review: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      avatar: 'avatar2.jpg',
      name: 'Алёна',
      review: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      avatar: 'avatar3.jpg',
      name: 'Мария',
      review: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      avatar: 'avatar4.jpeg',
      name: 'Дмитрий',
      review: 'Давно искал понятные материалы по контекстной рекламе, и блог АйтиШторма стал для меня настоящей находкой. Теперь я сам веду проекты своих клиентов и благодарен команде за такой качественный фундамент.'
    },
    {
      avatar: 'avatar5.jpeg',
      name: 'Екатерина',
      review: 'Сотрудничаю с АйтиШтормом уже полгода, и моя лента в соцсетях преобразилась до неузнаваемости. Ребята не просто дают советы, а заряжают энергией творить и развиваться дальше. Огромное спасибо!'
    },
    {
      avatar: 'avatar6.jpg',
      name: 'Андрей',
      review: 'Раньше я скептически относился к блогам про маркетинг, но статьи АйтиШторма сломали этот стереотип. Здесь реально полезная информация без воды, которая мотивирует пробовать новое и не бояться ошибок.'
    }
  ]
}
