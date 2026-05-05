import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { ArticleService } from '../../../shared/services/article-service';
import { ArticleType } from '../../../../types/articles.type';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DetectResponseUtilite } from '../../../shared/utils/detect-response-utilite';
import { environment } from '../../../../environments/environment';
import { RequestService } from '../../../shared/services/request-service';
import { map, catchError, of } from 'rxjs';
import { CategoryType } from '../../../../types/category.type';
import { FilterParamType } from '../../../../types/filter-param.type';
import { ArticlesFilterService } from '../../../shared/services/articles-filter-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blog-component',
  standalone: false,
  templateUrl: './blog-component.html',
  styleUrl: './blog-component.scss',
})
export class BlogComponent {
  private readonly articleService = inject(ArticleService);
  private readonly articlesFilterService = inject(ArticlesFilterService);
  private readonly requestService = inject(RequestService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected currentFilter = signal<FilterParamType>({});

  protected articles = signal<ArticleType[]>([]);
  protected pages = signal<number[]>([]);
  protected serverPath: string = environment.serverStaticPath;
  protected open = signal<boolean>(false);

  protected categories = toSignal(this.requestService.getCategories().pipe(
    map(data => {
      if (DetectResponseUtilite.isErrorResponse(data)) {
        console.error(data.message);
        return [] as CategoryType[];
      } else {
        return data;
      }
    }),
    catchError(error => {
      console.error('Failed to load categories:', error);
      return of([] as CategoryType[]);
    })
  ), { initialValue: [] });

  protected selectFilters = computed(() => {
    const categories = this.categories();
    const filter = this.articlesFilterService.activeFilter();
    const selectedCategories = filter['categories[]'] || [];

    return categories.map((item) => ({
      ...item,
      select: selectedCategories.includes(item.url)
    }));
  });

  constructor() {
    const effectRef = effect(() => {
      const filter = this.articlesFilterService.activeFilter();
      this.loadArticles(filter);
    });

    this.destroyRef.onDestroy(() => {
      effectRef.destroy();
    });

    const initParam: FilterParamType = { ...this.activatedRoute.snapshot.queryParams };
    if (initParam.page) initParam.page = +initParam.page;

    this.currentFilter.set(initParam);
    this.articlesFilterService.setFilter(initParam);
  }

  private loadArticles(filter: FilterParamType): void {
    this.articleService.getBlog(filter).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          console.error(data.message);
        } else {
          this.articles.set(data.items);
          if (data.pages > 1) {
            this.pages.set(Array.from({ length: data.pages }, (_, i) => i + 1))
          } else {
            this.pages.set([]);
            if (this.currentFilter().page) {
              this.currentFilter.update(filter => {
                const newFilter = { ...filter };
                delete newFilter.page;
                return newFilter;
              });
            };
          };
        };
      },
      error: (error) => console.error(error)
    });
  }

  protected toggleOpen(): void {
    this.open.set(!this.open());
  }

  protected setFilter(param: { category?: string, page?: number }): void {
    const newFilter: FilterParamType = { ...this.currentFilter() };

    if (param.category) {
      const categoriesKey = 'categories[]';
      const currentCats = (newFilter[categoriesKey] as string[]) || [];
      const updatedCats = currentCats.includes(param.category)
        ? currentCats.filter(cat => cat !== param.category)
        : [...currentCats, param.category];

      newFilter.page = 1;
      if (updatedCats.length === 0) {
        delete newFilter[categoriesKey];
      } else {
        newFilter[categoriesKey] = updatedCats;
      }
    };

    if (param.page) {
      if (param.page === 1) {
        delete newFilter['page'];
      } else {
        newFilter['page'] = param.page;
      }
    };

    this.currentFilter.set(newFilter);
    this.articlesFilterService.setFilter(newFilter);
  }

  protected openPrevPage(): void {
    const newFilter: FilterParamType = { ...this.currentFilter() };
    const page = newFilter.page;

    if (page && page > 1) {
      newFilter.page = page - 1;
      if (newFilter.page === 1) {
        delete newFilter.page;
      }
      this.currentFilter.set(newFilter);
      this.articlesFilterService.setFilter(newFilter);
    }
  }

  protected openNextPage(): void {
    const newFilter: FilterParamType = { ...this.currentFilter() };

    if (newFilter.page && newFilter.page < this.pages().length) {
      newFilter.page += 1;
    } else if (!newFilter.page && this.pages().length > 1) {
      newFilter.page = 2;
    } else {
      return;
    }

    this.currentFilter.set(newFilter);
    this.articlesFilterService.setFilter(newFilter);
  }
}
