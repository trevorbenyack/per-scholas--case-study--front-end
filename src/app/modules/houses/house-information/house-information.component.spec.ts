import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseInformationComponent } from './house-information.component';

describe('CreateNewHouseComponent', () => {
  let component: HouseInformationComponent;
  let fixture: ComponentFixture<HouseInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
