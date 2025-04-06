import { ComponentFixture, TestBed } from '@angular/core/testing';

import { prestamoComponent } from './prestamo.component';

describe('AutorComponent', () => {
  let component: prestamoComponent;
  let fixture: ComponentFixture<prestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [prestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(prestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
