import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerTaskPageComponent } from './volunteer-task-page.component';

describe('VolunteerTaskPageComponent', () => {
  let component: VolunteerTaskPageComponent;
  let fixture: ComponentFixture<VolunteerTaskPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerTaskPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
