import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCommentComponent } from './edit-comment.component';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let fixture: ComponentFixture<EditCommentComponent>;
  let commentServiceMock: jasmine.SpyObj<CommentService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Create mock objects
    commentServiceMock = jasmine.createSpyObj('CommentService', ['getCommentById', 'updateComment']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['params']);

    await TestBed.configureTestingModule({
      imports: [ EditCommentComponent ],
      providers: [
        { provide: CommentService, useValue: commentServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })  // Mocking the params observable
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when comment is not found (404)', () => {
    activatedRouteMock.params = of({ commentId: 1 });
    commentServiceMock.getCommentById.and.returnValue(throwError({ status: 404 }));

    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Comment not found with ID: 1');
  });

  it('should call getCommentById with the correct ID', () => {
    const commentId = 1;
    activatedRouteMock.params = of({ commentId });
    commentServiceMock.getCommentById.and.returnValue(of({ id: commentId, description: 'Test', authorName: 'Author', postId: 1 }));

    component.ngOnInit();

    expect(commentServiceMock.getCommentById).toHaveBeenCalledWith(commentId);
  });

  it('should show an error message if getCommentById fails', () => {
    activatedRouteMock.params = of({ commentId: 1 });
    commentServiceMock.getCommentById.and.returnValue(throwError({ status: 500 }));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Failed to load the post');
  });

  it('should create the component and load the comment', () => {
    const mockComment = { id: 1, description: 'Test description', authorName: 'Author', postId: 1 };
    activatedRouteMock.params = of({ commentId: 1 });
    commentServiceMock.getCommentById.and.returnValue(of(mockComment));

    component.ngOnInit();

    expect(component.comment).toEqual(mockComment);
  });

  it('should display comment content and author correctly', () => {
    const mockComment = { id: 1, description: 'Test description', authorName: 'Author', postId: 1 };
    activatedRouteMock.params = of({ commentId: 1 });
    commentServiceMock.getCommentById.and.returnValue(of(mockComment));

    component.ngOnInit();

    expect(component.comment.description).toBe('Test description');
    expect(component.comment.authorName).toBe('Author');
  });

  it('should handle any other errors correctly', () => {
    activatedRouteMock.params = of({ commentId: 1 });
    commentServiceMock.getCommentById.and.returnValue(throwError({ status: 500 }));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Failed to load the post');
  });
});
