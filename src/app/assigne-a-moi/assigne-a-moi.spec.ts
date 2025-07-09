import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneAMoiComponent  } from './assigne-a-moi';

describe('AssigneAMoi', () => {
  let component:AssigneAMoiComponent ;
  let fixture: ComponentFixture<AssigneAMoiComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneAMoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneAMoiComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
