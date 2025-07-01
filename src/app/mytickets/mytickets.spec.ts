import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  MyTicketsComponent  } from './mytickets';

describe('Mytickets', () => {
  let component: MyTicketsComponent ;
  let fixture: ComponentFixture<MyTicketsComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTicketsComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
