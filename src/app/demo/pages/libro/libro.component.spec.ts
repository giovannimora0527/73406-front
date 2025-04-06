import { ComponentFixture, TestBed } from '@angular/core/testing';

import { libroComponent } from './libro.component';

describe('AutorComponent', () => {
  let component: libroComponent;
  let fixture: ComponentFixture<libroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [libroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(libroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
