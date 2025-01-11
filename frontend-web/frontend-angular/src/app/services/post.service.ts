import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { PostComment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:8081/api/post';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}`);
  }

  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/published`);
  }

  getApprovedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/approved`);
  }

  getRejectedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/rejected`);
  }

  getDraftPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/drafts`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/${post.id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
