import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendeeListsComponent } from './atendee-lists.component';

describe('AtendeeListsComponent', () => {
  let component: AtendeeListsComponent;
  let fixture: ComponentFixture<AtendeeListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendeeListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendeeListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
