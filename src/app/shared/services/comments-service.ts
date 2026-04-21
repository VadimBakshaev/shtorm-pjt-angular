import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommentRequestBodyType, CommentResponseType } from '../../../types/articles.type';
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
}
