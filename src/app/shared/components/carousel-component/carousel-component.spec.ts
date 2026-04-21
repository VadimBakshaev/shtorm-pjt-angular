import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCarouselComponent } from './carousel-component';

describe('CarouselComponent', () => {
  let component: BannerCarouselComponent;
  let fixture: ComponentFixture<BannerCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerCarouselComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
