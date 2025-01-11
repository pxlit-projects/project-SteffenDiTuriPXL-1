import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraftComponent } from './draft.component';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Post } from '../../models/post.model';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mocking PostService
class MockPostService {
  getDraftPosts() {
    return of([{ id: 1, title: 'Test Draft', content: 'Draft content', draft: true }]);
  }

  updatePost(post: Post) {
    return of({ ...post, title: 'Updated Title' });
  }
}

describe('DraftComponent', () => {
  let component: DraftComponent;
  let fixture: ComponentFixture<DraftComponent>;
  let postService: PostService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftComponent, HttpClientTestingModule], // Import DraftComponent here
      providers: [
        { provide: PostService, useClass: MockPostService },
        Router
      ],
      schemas: [NO_ERRORS_SCHEMA] // Avoid errors from missing elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load draft posts on init', () => {
    spyOn(postService, 'getDraftPosts').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(postService.getDraftPosts).toHaveBeenCalled();
    expect(component.draftPosts.length).toBeGreaterThan(0);
    expect(component.draftPosts[0].title).toBe('Test Draft');
  });

  it('should handle error when loading draft posts fails', () => {
    spyOn(postService, 'getDraftPosts').and.returnValue(throwError('Error loading drafts'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Failed to load draft posts');
  });

  it('should save the draft post and navigate to drafts', () => {
    const post: Post = { id: 1, title: 'Test Draft', content: 'Draft content', draft: true };

    spyOn(postService, 'updatePost').and.callThrough();
    spyOn(router, 'navigate');

    component.saveDraft(post);
    fixture.detectChanges();

    expect(postService.updatePost).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/drafts']);
  });

  it('should handle error when saving a draft fails', () => {
    const post: Post = { id: 1, title: 'Test Draft', content: 'Draft content', draft: true };

    spyOn(postService, 'updatePost').and.returnValue(throwError('Error saving draft'));

    component.saveDraft(post);
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to save draft');
  });
});
