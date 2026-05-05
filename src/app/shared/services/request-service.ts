import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from '../../../types/default-response.type';
import { CategoryType } from '../../../types/category.type';
import { environment } from '../../../environments/environment';
import { OrderRequestParamsType, RequestParamsType } from '../../../types/request-params.type';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private readonly http = inject(HttpClient);

  public getCategories(): Observable<CategoryType[] | DefaultResponseType> {
    return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'categories');
  }

  public request(params: OrderRequestParamsType | RequestParamsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', params);
  }
}
