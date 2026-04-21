import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesBadgetComponent } from './categories-badget-component';

describe('CategoriesBadgetComponent', () => {
  let component: CategoriesBadgetComponent;
  let fixture: ComponentFixture<CategoriesBadgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesBadgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesBadgetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
