import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviCandidatsComponent } from './suivi-candidats.component';

describe('SuiviCandidatsComponent', () => {
  let component: SuiviCandidatsComponent;
  let fixture: ComponentFixture<SuiviCandidatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviCandidatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviCandidatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
