import { inject, Injectable, signal } from '@angular/core';
import { FilterParamType } from '../../../types/filter-param.type';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ArticlesFilterService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private activeFilterS = signal<FilterParamType>({});
  public readonly activeFilter = this.activeFilterS.asReadonly();
  
  constructor() {
    this.setFilter({ ...this.activatedRoute.snapshot.params });
  }

  public setFilter(params: FilterParamType | Params) {
    this.activeFilterS.set({ ...params });
    this.router.navigate(['/blog'], {
      queryParams: params
    })
  }

  public getFilter(): FilterParamType {
    return this.activeFilterS();    
  }
}
