import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../../types/default-response.type';
import { ArticleCoreType, ArticleType, BlogResponseType } from '../../../types/articles.type';
import { FilterParamType } from '../../../types/filter-param.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);

  public getBestArticles(): Observable<DefaultResponseType | ArticleType[]> {
    return this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/top');
  }

  public getBlog(params: FilterParamType): Observable<BlogResponseType | DefaultResponseType> {
    return this.http.get<BlogResponseType | DefaultResponseType>(environment.api + 'articles', { params: params });
  }

  public getArticle(url: string): Observable<DefaultResponseType | ArticleCoreType> {
    return this.http.get<DefaultResponseType | ArticleCoreType>(environment.api + 'articles/' + url);
  }

  public getRelatedArticle(url: string): Observable<DefaultResponseType | ArticleType[]> {
    return this.http.get<DefaultResponseType | ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
