import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8083/api/review';

  constructor(private http: HttpClient) {}

  getPendingReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}`);
  }

  updateReviewStatus(id: number, postReviewDto: any): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, postReviewDto);
  }
}
