import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardComponent } from './mytickets';

describe('Mytickets', () => {
  let component:KanbanBoardComponent ;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
