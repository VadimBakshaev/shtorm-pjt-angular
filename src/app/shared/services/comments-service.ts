import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommentRequestBodyType, CommentResponseType, UserActionCommentType } from '../../../types/articles.type';
import { DefaultResponseType } from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);

  public getComments(offset: number, article: string): Observable<CommentResponseType | DefaultResponseType> {
    return this.http.get<CommentResponseType | DefaultResponseType>(environment.api + 'comments', { params: { offset, article } });
  }

  public addComment(body: CommentRequestBodyType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', body);
  }

  public addActionForComment(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', { action });
  }

  public getActionsForArticle(articleId: string): Observable<UserActionCommentType[] | DefaultResponseType> {
    return this.http.get<UserActionCommentType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', { params: { articleId } });
  }

  public getActionForComment(id: string): Observable<UserActionCommentType | DefaultResponseType> {
    return this.http.get<UserActionCommentType | DefaultResponseType>(environment.api + 'comments/' + id + '/actions');
  }
}
