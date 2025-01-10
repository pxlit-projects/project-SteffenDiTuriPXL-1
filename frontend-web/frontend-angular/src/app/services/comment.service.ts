import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8082/api/comment';

  constructor(private http: HttpClient) {}

  getComments(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?postId=${postId}`);
  }

  addComment(comment: { postId: string, description: string, authorName: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, comment);
  }
}
