import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopidPage } from './stopid.page';

describe('StopidPage', () => {
  let component: StopidPage;
  let fixture: ComponentFixture<StopidPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(StopidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
