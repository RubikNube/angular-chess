import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPgnComponent } from './import-pgn.component';

describe('ImportPgnComponent', () => {
  let component: ImportPgnComponent;
  let fixture: ComponentFixture<ImportPgnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPgnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPgnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
