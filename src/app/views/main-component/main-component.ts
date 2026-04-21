import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleService } from '../../shared/services/article-service';
import { catchError, map, of } from 'rxjs';
import { ArticleType } from '../../../types/articles.type';
import { environment } from '../../../environments/environment';
import { DetectResponseUtilite } from '../../shared/utils/detect-response-utilite';
import { Dialog } from '@angular/cdk/dialog';
import { ModalDialogComponent } from '../../shared/components/modal-dialog-component/modal-dialog-component';

@Component({
  selector: 'main-component',
  standalone: false,
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss',
})
export class MainComponent {
  private readonly articleService = inject(ArticleService);
  private readonly dialog = inject(Dialog);


  protected serverPath: string = environment.serverStaticPath;
  protected topArticles = toSignal(this.articleService.getBestArticles().pipe(
    map(data => {
      if (DetectResponseUtilite.isErrorResponse(data)) {
        console.error(data.message);
        return [] as ArticleType[];
      } else {
        return data as ArticleType[];
      }
    }),
    catchError(error => {
      console.error('Failed to load best articles:', error);
      return of([] as ArticleType[]);
    })
  ), { initialValue: [] as ArticleType[] });

  protected serviceItems = [
    {
      id: 'service1',
      img: 'service1.jpg',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500₽',
      url: 'dizain'
    },
    {
      id: 'service2',
      img: 'service2.jpg',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500₽',
      url: 'smm'
    },
    {
      id: 'service3',
      img: 'service3.jpg',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000₽',
      url: 'target'
    },
    {
      id: 'service4',
      img: 'service4.jpg',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750₽',
      url: 'kopiraiting'
    },
  ];

  protected openDialog(url: string) {
    this.dialog.open(ModalDialogComponent, {
      data: { type: 'order', service: url }
    })
  }

}
