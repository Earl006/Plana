import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagerRequestsComponent } from './admin-manager-requests.component';

describe('AdminManagerRequestsComponent', () => {
  let component: AdminManagerRequestsComponent;
  let fixture: ComponentFixture<AdminManagerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManagerRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManagerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
