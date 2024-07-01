import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTermsPage } from './service-terms.page';

describe('ServiceTermsComponent', () => {
  let component: ServiceTermsPage;
  let fixture: ComponentFixture<ServiceTermsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTermsPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
