import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsCarouselComponent } from './reviews-carousel-component';

describe('ReviewsCarouselComponent', () => {
  let component: ReviewsCarouselComponent;
  let fixture: ComponentFixture<ReviewsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsCarouselComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
