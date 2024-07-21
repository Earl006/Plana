import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthrorisedComponent } from './unauthrorised.component';

describe('UnauthrorisedComponent', () => {
  let component: UnauthrorisedComponent;
  let fixture: ComponentFixture<UnauthrorisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthrorisedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthrorisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
