import { TestBed } from '@angular/core/testing';

import { ArticlesFilterService } from './articles-filter-service';

describe('ArticlesFilterService', () => {
  let service: ArticlesFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
