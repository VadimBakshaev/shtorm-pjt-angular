import { Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { CommentsService } from '../../services/comments-service';
import { CommentsWithAction, UserActionCommentType } from '../../../../types/articles.type';
import { DetectResponseUtilite } from '../../utils/detect-response-utilite';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, throwError } from 'rxjs';

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
  protected isLogged = this.authService.isLogged;

  constructor() {
    effect(() => {
      this.locComment.set(this.comment());
    });
  }

  protected setAction(event: Event) {
    const element = (event.target as HTMLElement).closest<HTMLElement>('.action');

    if (element) {
      if (!this.isLogged()) {
        this.snackBar.open('Для данных действий необходимо авторизоваться');
        return;
      }
      const action: string = element.dataset['action'] ?? '';
      if (!action) return;
      const locComment = this.locComment();
      if (action === 'like') {
        if (locComment.action === action) {
          locComment.action = '';
          locComment.likesCount--;
        } else if (locComment.action) {
          locComment.action = action;
          locComment.likesCount++;
          locComment.dislikesCount--;
        } else {
          locComment.action = action;
          locComment.likesCount++;
        }
      } else if (action === 'dislike') {
        if (locComment.action === action) {
          locComment.action = '';
          locComment.dislikesCount--;
        } else if (locComment.action) {
          locComment.action = action;
          locComment.dislikesCount++;
          locComment.likesCount--;
        } else {
          locComment.action = action;
          locComment.dislikesCount++;
        }
      };
      this.commentsService.addActionForComment(this.comment().id, action).pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          if (action === 'violate' && error.status === 400) {
            this.snackBar.open('Жалоба уже отправлена');
            return of(error.error);
          };
          return throwError(() => error);
        })
      ).subscribe({
        next: data => {
          if (!data.error) {
            if (action === 'violate') {
              this.snackBar.open('Жалоба отправлена');
            } else {
              this.snackBar.open('Ваш голос учтен');
            };
            this.commentsService.getActionForComment(this.comment().id).subscribe(
              data => {
                if (DetectResponseUtilite.isErrorResponse(data)) {
                  console.error(data.message)
                } else {
                  this.outAction.emit(data);

                }
              }
            )
          } else {
            console.log('add action response error message: ', data.message);
          }

          console.log('this response of action: ', data);
        },
        error: (error) => {
          console.log(error);
        }
      });
      console.log('proceed');
      this.locComment.set(locComment);
    }
  }
}
