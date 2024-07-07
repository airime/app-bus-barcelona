import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContentHeaderComponent } from './content-header.component';

describe('ContentHeaderComponent', () => {
  let component: ContentHeaderComponent;
  let fixture: ComponentFixture<ContentHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ContentHeaderComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ContentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
