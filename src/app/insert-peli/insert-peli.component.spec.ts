import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertPeliComponent } from './insert-peli.component';

describe('InsertPeliComponent', () => {
  let component: InsertPeliComponent;
  let fixture: ComponentFixture<InsertPeliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertPeliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertPeliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
