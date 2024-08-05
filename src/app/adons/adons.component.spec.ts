import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdonsComponent } from './adons.component';

describe('AdonsComponent', () => {
  let component: AdonsComponent;
  let fixture: ComponentFixture<AdonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
