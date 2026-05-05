import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../shared/services/article-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ArticleComentType, ArticleCoreType, ArticleType, CommentRequestBodyType, CommentsWithAction, UserActionCommentType } from '../../../../types/articles.type';
import { map, catchError, of, filter, switchMap, startWith, distinctUntilChanged } from 'rxjs';
import { DetectResponseUtilite } from '../../../shared/utils/detect-response-utilite';
import { environment } from '../../../../environments/environment';
import { CommentsService } from '../../../shared/services/comments-service';
import { AuthService } from '../../../core/auth/auth-service';

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
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private totalComments: number = 0;
  private routeParams = toSignal(
    this.activatedRoute.params.pipe(
      map(params => params['url']),
      distinctUntilChanged()
    ),
    { initialValue: this.activatedRoute.snapshot.params['url'] }
  );

  protected isLogged = this.authService.isLogged;
  protected userActions: UserActionCommentType[] = [];
  protected isLoad = signal<boolean>(false);
  protected textCom = signal<string>('');
  protected serverPath: string = environment.serverStaticPath;
  protected comments = signal<CommentsWithAction[]>([]);
  protected article = toSignal(
    toObservable(this.routeParams).pipe(
      switchMap(url =>
        this.articleService.getArticle(url).pipe(
          map(data => {
            if (DetectResponseUtilite.isErrorResponse(data)) {
              console.error(data.message);
              return {} as ArticleCoreType;
            } else {
              this.totalComments = data.commentsCount;
              this.getActionUser(data.comments, data.id);
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
    return comments.length < this.totalComments;
  });

  constructor() {
    effect(() => {
      if (this.article()) {
        window.scrollTo(0, 0);
      }
    });
  };

  protected getComments(isNew: boolean): void {
    if (!isNew) this.isLoad.set(true);

    let offset: number;
    if (isNew || this.comments().length - 3 < 0) {
      offset = 0;
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
            this.getActionUser(data.comments);
          } else {
            this.getActionUser([...this.comments(), ...data.comments]);
            this.isLoad.set(false);
          }
          this.totalComments = data.allCount;
        }
      },
      error: () => console.log('Fail to load comment')
    });

  };

  private getActionUser(data: ArticleComentType[], articleId?: string | undefined): void {
    if (this.isLogged()) {
      this.commentsService.getActionsForArticle(
        articleId
          ? articleId
          : this.article().id
      ).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        actions => {
          if (DetectResponseUtilite.isErrorResponse(actions)) {
            console.error(actions.message)
          } else {
            this.userActions = actions;
            const comments: CommentsWithAction[] = data.map(comment => {
              const found = this.userActions.find(com => com.comment === comment.id);
              (comment as CommentsWithAction).action = found ? found.action : '';
              return comment as CommentsWithAction;
            });
            this.comments.set(comments);            
          }
        }
      );
    } else {
      this.comments.set(data);
    }
  };

  protected onInput(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) this.textCom.set(event.target.value);
  };

  protected addComment(): void {
    const body: CommentRequestBodyType = {
      text: this.textCom(),
      article: this.article().id
    }
    this.commentsService.addComment(body).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.getComments(true);
        this.textCom.set('');        
      },
      error: () => console.error('error to add comment')
    });
  };

  protected updateAction(upd: UserActionCommentType): void {
    this.comments.update(comments =>
      comments.map(comment =>
        comment.id === upd.comment
          ? { ...comment, action: upd.action }
          : comment
      )
    );
  };

  protected shareArticle(event: Event): void {
    const element = (event.target as HTMLElement).closest<HTMLElement>('.social');
    if (!element) return;

    const social: string = element.dataset['social'] ?? '';
    if (!social) return;

    const articleUrl = window.location.href;

    switch (social) {
      case 'vk':
        window.open(
          `https://vk.com/share.php?url=${encodeURIComponent(articleUrl)}`,
          '_blank'
        );
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
          '_blank'
        );
        break;

      case 'instagram':
        navigator.clipboard.writeText(articleUrl).then(() => {
          console.log('Ссылка скопирована:', articleUrl);
        }).catch(err => {
          console.error('Ошибка копирования:', err);
        });
        window.open('https://www.instagram.com', '_blank');
        break;
    }
  }
}
