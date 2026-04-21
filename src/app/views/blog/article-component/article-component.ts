import { Component, computed, DestroyRef, effect, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../shared/services/article-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ArticleComentType, ArticleCoreType, ArticleType, CommentRequestBodyType, CommentResponseType } from '../../../../types/articles.type';
import { map, catchError, of, filter, switchMap, startWith, distinctUntilChanged } from 'rxjs';
import { DetectResponseUtilite } from '../../../shared/utils/detect-response-utilite';
import { environment } from '../../../../environments/environment';
import { CommentsService } from '../../../shared/services/comments-service';

@Component({
  selector: 'article-component',
  standalone: false,
  templateUrl: './article-component.html',
  styleUrl: './article-component.scss',
})
export class ArticleComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);

  private showCommentsCount: number = 3;
  private totalComments: number = 0;
  private routeParams = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['url']),
      distinctUntilChanged()
    ),
    { initialValue: this.activatedRoute.snapshot.params['url'] }
  );

  protected textCom = signal<string>('');
  protected serverPath: string = environment.serverStaticPath;
  protected comments = signal<ArticleComentType[]>([]);
  protected article = toSignal(
    toObservable(this.routeParams).pipe(
      switchMap(url =>
        this.articleService.getArticle(url).pipe(
          map(data => {
            if (DetectResponseUtilite.isErrorResponse(data)) {
              console.error(data.message);
              return {} as ArticleCoreType;
            } else {
              console.log(data);
              this.comments.set(data.comments);
              this.totalComments = data.commentsCount;
              return data;
            }
          }),
          catchError(error => {
            console.error('Failed to load categories:', error);
            return of({} as ArticleCoreType);
          })
        )
      )
    ), { initialValue: {} as ArticleCoreType });

  protected relatedArticles = toSignal(
    toObservable(this.article).pipe(
      filter(article => !!article?.url),
      switchMap(article =>
        this.articleService.getRelatedArticle(article.url).pipe(
          map(data =>
            DetectResponseUtilite.isErrorResponse(data) ? [] : data as ArticleType[]
          ),
          catchError(() => {
            console.error('Fail to load Related articles');
            return of([]);
          })
        )
      ),
      startWith([])
    ), { initialValue: [] });

  protected showProceed = computed(() => {
    const comments = this.comments();
    return comments.length < this.article().commentsCount;
  });

  constructor() {
    effect(() => {
      if (this.article()) {
        window.scrollTo(0, 0);
      }
    });
  };

  protected getComments(isNew: boolean) {
    // if (this.article().commentsCount - 3 < 0) {
    //   skip = 0;
    // } else if (skip<this.comments().length) {
    //   skip=this.comments().length;
    // }

    console.log('article comment count: ', this.article().commentsCount);
    console.log('comments length: ', this.comments().length);

    // if (this.article().commentsCount <= this.comments().length) {
    //   isNew = true;
    //   if (this.comments().length - 3 < 0) {
    //     skip = 0
    //   } else {
    //     skip = this.comments().length
    //   }
    // }
    let offset: number;
    if (isNew || this.comments().length - 3 < 0) {
      offset = 0;
      this.showCommentsCount = 3;
    } else if(this.totalComments>this.showCommentsCount){
      offset = (this.totalComments - this.showCommentsCount % 3) + this.showCommentsCount;
      this.showCommentsCount += offset;
    } else {
      offset = this.comments().length;
    }

    this.commentsService.getComments(offset, this.article().id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          console.error(data.message)
        } else {
          if (isNew) {
            this.comments.set(data.comments);
          } else {
            this.comments.update(current => ([...current, ...data.comments]));
          }
          this.totalComments = data.allCount;
          console.log('this response comments: ', data);
        }
      },
      error: () => console.log('error to load comment')
    })

  };

  protected onInput(event: Event) {
    if (event.target instanceof HTMLTextAreaElement) this.textCom.set(event.target.value);
  };

  protected addComment() {
    console.log(this.textCom());
    const body: CommentRequestBodyType = {
      text: this.textCom(),
      article: this.article().id
    }
    this.commentsService.addComment(body).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.getComments(true);
        console.log('ответ на отправку коммента: ', data.message);
      },
      error: () => console.error('error to add comment')
    });
  };

}
