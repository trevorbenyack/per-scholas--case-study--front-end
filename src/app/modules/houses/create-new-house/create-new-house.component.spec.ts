import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewHouseComponent } from './create-new-house.component';

describe('CreateNewHouseComponent', () => {
  let component: CreateNewHouseComponent;
  let fixture: ComponentFixture<CreateNewHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
