import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { PostComment } from '../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8082/api/comment';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get comments by postId', () => {
    const mockComments: PostComment[] = [
      { id: 1, postId: 1, authorName: 'Author 1', description: 'Comment 1' },
      { id: 2, postId: 1, authorName: 'Author 2', description: 'Comment 2' }
    ];
    
    const postId = '1';
    service.getComments(postId).subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${baseUrl}?postId=${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should add a new comment', () => {
    const newComment: PostComment = {
      id: 3,
      postId: 1,
      authorName: 'Author 3',
      description: 'New Comment'
    };

    service.addComment(newComment).subscribe((comment) => {
      expect(comment).toEqual(newComment);
    });

    const req = httpMock.expectOne(`${baseUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newComment);
    req.flush(newComment);
  });

  it('should get comment by id', () => {
    const mockComment: PostComment = {
      id: 1,
      postId: 1,
      authorName: 'Author 1',
      description: 'Comment 1'
    };

    service.getCommentById(1).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComment);
  });

  it('should get all comments', () => {
    const mockComments: PostComment[] = [
      { id: 1, postId: 1, authorName: 'Author 1', description: 'Comment 1' },
      { id: 2, postId: 1, authorName: 'Author 2', description: 'Comment 2' }
    ];

    service.getAllComments().subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should update a comment', () => {
    const updatedComment: PostComment = {
      id: 1,
      postId: 1,
      authorName: 'Author 1',
      description: 'Updated Comment'
    };

    service.updateComment(updatedComment).subscribe(() => {
      expect(updatedComment.description).toBe('Updated Comment');
    });

    const req = httpMock.expectOne(`${baseUrl}/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      id: updatedComment.id,
      description: updatedComment.description
    });
    req.flush(null);
  });
});
