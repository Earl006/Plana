import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTicketsComponent } from './verify-tickets.component';

describe('VerifyTicketsComponent', () => {
  let component: VerifyTicketsComponent;
  let fixture: ComponentFixture<VerifyTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
