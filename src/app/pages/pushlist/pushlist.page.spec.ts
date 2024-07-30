import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushListPage } from './pushlist.page';

describe('StopidPage', () => {
  let component: PushListPage;
  let fixture: ComponentFixture<PushListPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PushListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
