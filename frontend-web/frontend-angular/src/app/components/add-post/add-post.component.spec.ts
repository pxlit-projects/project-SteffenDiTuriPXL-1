import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpTestingController: HttpTestingController;

  const mockUser = {
    username: 'testUser',
    role: 'user'
  };

  beforeEach(async () => {
    const postServiceSpyObj = jasmine.createSpyObj('PostService', ['createPost']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Set up the mock user
    authServiceSpyObj.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        AddPostComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    // Get the injected services and spies
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no requests are outstanding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('');
    expect(component.content).toBe('');
    expect(component.draft).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
    expect(component.userName).toBe('testUser');
    expect(component.authorName).toBe('testUser');
  });

  it('should get username from AuthService on initialization', () => {
    expect(authServiceSpy.getUser).toHaveBeenCalled();
    expect(component.userName).toBe(mockUser.username);
    expect(component.authorName).toBe(mockUser.username);
  });

  it('should handle null user from AuthService', () => {
    authServiceSpy.getUser.and.returnValue(null);
    
    // Re-create component to trigger constructor
    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    
    expect(component.userName).toBe('Unknown');
    expect(component.authorName).toBe('Unknown');
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.title = 'Test Title';
      component.content = 'Test Content';
      component.authorName = 'Test Author';
      component.draft = false;
    });

    it('should create post and navigate to dashboard on success', fakeAsync(() => {
      const expectedPost = {
        id: 0,
        title: 'Test Title',
        content: 'Test Content',
        authorName: 'Test Author',
        draft: false
      };

      postServiceSpy.createPost.and.returnValue(of({ ...expectedPost, id: 1 }));

      component.onSubmit();
      tick();

      expect(postServiceSpy.createPost).toHaveBeenCalledWith(expectedPost);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle error when creating post fails', fakeAsync(() => {
      const expectedError = new Error('Server error');
      postServiceSpy.createPost.and.returnValue(throwError(() => expectedError));
      
      spyOn(console, 'error');
      
      component.onSubmit();
      tick();

      expect(postServiceSpy.createPost).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error creating post:', expectedError);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

    it('should send post with draft status when draft is true', fakeAsync(() => {
      component.draft = true;
      
      const expectedPost = {
        id: 0,
        title: 'Test Title',
        content: 'Test Content',
        authorName: 'Test Author',
        draft: true
      };

      postServiceSpy.createPost.and.returnValue(of({ ...expectedPost, id: 1 }));

      component.onSubmit();
      tick();

      expect(postServiceSpy.createPost).toHaveBeenCalledWith(expectedPost);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));
  });
});