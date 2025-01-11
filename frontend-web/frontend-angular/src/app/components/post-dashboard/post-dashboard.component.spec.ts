import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostDashboardComponent } from './post-dashboard.component';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { CommentService } from '../../services/comment.service';

describe('PostDashboardComponent', () => {
  let component: PostDashboardComponent;
  let fixture: ComponentFixture<PostDashboardComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;

  const mockPosts: Post[] = [
    {
      id: 1, title: 'Test Post 1', content: 'Content 1', authorName: 'user1',
      draft: false
    },
    {
      id: 2, title: 'Test Post 2', content: 'Content 2', authorName: 'user2',
      draft: false
    }
  ];

  const mockUser = { username: 'testUser', role: 'user' };

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['getApprovedPosts']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    commentServiceSpy = jasmine.createSpyObj('CommentService', ['getComments']);

    await TestBed.configureTestingModule({
      imports: [
        PostDashboardComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: CommentService, useValue: commentServiceSpy },
        HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load posts and set current user on initialization', fakeAsync(() => {
      postServiceSpy.getApprovedPosts.and.returnValue(of(mockPosts));
      authServiceSpy.getUser.and.returnValue(mockUser);

      component.ngOnInit();
      tick();

      expect(component.posts).toEqual(mockPosts);
      expect(component.filteredPosts).toEqual(mockPosts);
      expect(component.currentUser).toEqual(mockUser);
      expect(postServiceSpy.getApprovedPosts).toHaveBeenCalled();
      expect(authServiceSpy.getUser).toHaveBeenCalled();
    }));

    it('should handle error when loading posts fails', fakeAsync(() => {
      postServiceSpy.getApprovedPosts.and.returnValue(throwError(() => new Error('Server error')));
      authServiceSpy.getUser.and.returnValue(mockUser);

      component.ngOnInit();
      tick();

      expect(component.errorMessage).toBe('Failed to load posts');
      expect(component.posts).toEqual([]);
      expect(component.filteredPosts).toEqual([]);
    }));
  });

  describe('setFilteredPosts', () => {
    it('should set filtered posts and extract post IDs', () => {
      component.setFilteredPosts(mockPosts);

      expect(component.filteredPosts).toEqual(mockPosts);
      expect(component.postIds).toEqual([1, 2]);
    });

    it('should handle empty posts array', () => {
      component.setFilteredPosts([]);

      expect(component.filteredPosts).toEqual([]);
      expect(component.postIds).toEqual([]);
    });
  });

  describe('filterPosts', () => {
    beforeEach(() => {
      component.posts = mockPosts;
      component.filteredPosts = mockPosts;
    });

    it('should filter posts by title', () => {
      component.filterQuery = 'Test Post 1';
      component.filterPosts();

      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].title).toBe('Test Post 1');
    });

    it('should filter posts by content', () => {
      component.filterQuery = 'Content 2';
      component.filterPosts();

      expect(component.filteredPosts.length).toBe(1);
      expect(component.filteredPosts[0].content).toBe('Content 2');
    });

    it('should show all posts when filter query is empty', () => {
      component.filterQuery = '';
      component.filterPosts();

      expect(component.filteredPosts).toEqual(mockPosts);
    });

    it('should be case insensitive', () => {
      component.filterQuery = 'test POST';
      component.filterPosts();

      expect(component.filteredPosts.length).toBe(2);
    });
  });

  describe('onFilterChange', () => {
    it('should update filter query and trigger filtering', () => {
      const mockEvent = { target: { value: 'test query' } };
      spyOn(component, 'filterPosts');

      component.onFilterChange(mockEvent);

      expect(component.filterQuery).toBe('test query');
      expect(component.filterPosts).toHaveBeenCalled();
    });
  });

  describe('onAddPost', () => {
    it('should navigate to add-post route', () => {
      component.onAddPost();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/add-post']);
    });
  });
});