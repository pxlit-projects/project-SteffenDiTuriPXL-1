import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensures there are no pending HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', draft: false },
      { id: 2, title: 'Post 2', content: 'Content 2', draft: true }
    ];

    service.getAllPosts().subscribe(posts => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch published posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', draft: false }
    ];

    service.getPublishedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/published');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch approved posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', draft: false }
    ];

    service.getApprovedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/approved');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch rejected posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', draft: false }
    ];

    service.getRejectedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/rejected');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch draft posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', draft: true }
    ];

    service.getDraftPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/drafts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch post by ID', () => {
    const mockPost: Post = { id: 1, title: 'Post 1', content: 'Content 1', draft: false };

    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a new post', () => {
    const newPost: Post = { id: 0, title: 'New Post', content: 'New Content', draft: true };
    const createdPost: Post = { ...newPost, id: 1 };

    service.createPost(newPost).subscribe(post => {
      expect(post).toEqual(createdPost);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush(createdPost);
  });

  it('should update a post', () => {
    const updatedPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content', draft: false };

    service.updatePost(updatedPost).subscribe(post => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/post/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
    req.flush(updatedPost);
  });
});
