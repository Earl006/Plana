import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookNowComponent } from './book-now.component';

describe('BookNowComponent', () => {
  let component: BookNowComponent;
  let fixture: ComponentFixture<BookNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookNowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
