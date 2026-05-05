import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { CommentsService } from '../../services/comments-service';
import { CommentsWithAction, UserActionCommentType } from '../../../../types/articles.type';
import { DetectResponseUtilite } from '../../utils/detect-response-utilite';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'comment-component',
  standalone: false,
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.scss',
})
export class CommentComponent {
  private readonly commentsService = inject(CommentsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public comment = input.required<CommentsWithAction>();
  public outAction = output<UserActionCommentType>();

  protected locComment = signal<CommentsWithAction>({} as CommentsWithAction);

  constructor() {
    effect(() => {
      this.locComment.set(this.comment());
    });
  }

  protected setAction(event: Event): void {
    if (!this.authService.isLogged()) {
      this.snackBar.open('Для данных действий необходимо авторизоваться');
      return;
    };

    const element = (event.target as HTMLElement).closest<HTMLElement>('.action');
    if (!element) return;

    const action: string = element.dataset['action'] ?? '';
    if (!action) return;

    this.sendAction(action);
  };

  private sendAction(action: string): void {
    const prevAction = this.locComment();
    this.locComment.set(this.calculateNewAction(prevAction, action));

    this.commentsService.addActionForComment(this.comment().id, action).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(data => {
        if (!data.error) {
          if (action === 'violate') {
            this.snackBar.open('Жалоба отправлена');
          } else {
            this.snackBar.open('Ваш голос учтен');
          };
          return this.commentsService.getActionForComment(this.comment().id);
        } else {
          this.locComment.set(prevAction);
          console.log('add action response error message: ', data.message);
          return EMPTY;
        }
      }),
      catchError((error) => {
        this.locComment.set(prevAction);
        if (action === 'violate' && error.status === 400) {
          this.snackBar.open('Жалоба уже отправлена');
          return of(error.error);
        };
        return throwError(() => error);
      })
    ).subscribe(
      data => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          this.locComment.set(prevAction);
          console.error(data.message)
        } else {
          this.outAction.emit(data);
        }
      });
  };

  private calculateNewAction(comment: CommentsWithAction, action: string): CommentsWithAction {
    const updated = { ...comment };

    if (action === 'like') {
      if (updated.action === action) {
        updated.action = '';
        updated.likesCount--;
      } else if (updated.action === 'dislike') {
        updated.action = action;
        updated.likesCount++;
        updated.dislikesCount--;
      } else {
        updated.action = action;
        updated.likesCount++;
      }
    } else if (action === 'dislike') {
      if (updated.action === action) {
        updated.action = '';
        updated.dislikesCount--;
      } else if (updated.action === 'like') {
        updated.action = action;
        updated.dislikesCount++;
        updated.likesCount--;
      } else {
        updated.action = action;
        updated.dislikesCount++;
      }
    }

    return updated;
  };
}
