import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDraftComponent } from './edit-draft.component';

describe('EditDraftComponent', () => {
  let component: EditDraftComponent;
  let fixture: ComponentFixture<EditDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
