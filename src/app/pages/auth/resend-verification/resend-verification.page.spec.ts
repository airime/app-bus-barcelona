import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResendVerificationPage } from './resend-verification.page';

describe('ResendVerificationPage', () => {
  let component: ResendVerificationPage;
  let fixture: ComponentFixture<ResendVerificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
