import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { PostComment } from '../models/comment.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8082/api/comment';

  constructor(private http: HttpClient) {}

  getComments(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?postId=${postId}`);
  }

  addComment(comment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.baseUrl}/create`, comment);
  }
  
  getCommentById(id: number): Observable<PostComment> {
    return this.http.get<PostComment>(`${this.baseUrl}/${id}`);
  }

  // post.service.ts
  getCommentsByPostId(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.baseUrl}/${postId}`);
  }

  getAllComments(): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.baseUrl}`);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`);
  }

  updateComment(comment: PostComment): Observable<void> {
    const commentUpdateRequest = {
      id: comment.id,
      description: comment.description // assuming this is the field that gets updated
    };
    return this.http.put<void>(`${this.baseUrl}/update`, commentUpdateRequest);
  }
}
