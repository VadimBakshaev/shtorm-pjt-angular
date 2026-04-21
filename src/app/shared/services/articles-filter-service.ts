import { inject, Injectable, signal } from '@angular/core';
import { FilterParamType } from '../../../types/filter-param.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ArticlesFilterService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private activeFilterS = signal<FilterParamType>({});
  public readonly activeFilter = this.activeFilterS.asReadonly();
  // private activeFilter = new BehaviorSubject<FilterParamType>({});
  // public activeFilter$: Observable<FilterParamType> = this.activeFilter.asObservable();

  constructor() {
    //this.updateFilter(this.activatedRoute.snapshot.params);
    this.setFilter({ ...this.activatedRoute.snapshot.params });
  }

  private updateFilter(params: Params) {

    // console.log('Params in filter: ', params);
    // const activeParams: FilterParamType = {};
    // if (params['page'] !== undefined) activeParams['page'] = params['page'];
    // if (params['categories[]'] !== undefined) activeParams['categories[]'] = params['categories[]'];
    // console.log('Params out filter: ', activeParams);
    // this.activeFilter.next(activeParams);
  }

  public setFilter(params: FilterParamType | Params) {
    this.activeFilterS.set({ ...params });
    // this.updateFilter(params);
    this.router.navigate(['/blog'], {
      queryParams: params
    })
  }

  public getFilter(): FilterParamType {
    return this.activeFilterS();
    //return this.activeFilter.getValue();
  }
}
