import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPassComponent } from './show-pass-component';

describe('ShowPassComponent', () => {
  let component: ShowPassComponent;
  let fixture: ComponentFixture<ShowPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPassComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
