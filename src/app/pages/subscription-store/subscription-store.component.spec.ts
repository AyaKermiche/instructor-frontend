import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionStoreComponent } from './subscription-store.component';

describe('SubscriptionStoreComponent', () => {
  let component: SubscriptionStoreComponent;
  let fixture: ComponentFixture<SubscriptionStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
