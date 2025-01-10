import { Component, OnInit } from '@angular/core';
import { Review } from '../../models/review.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  userName: string = '';
  errorMessage: string = '';
  filterQuery: string = '';

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    this.userName = this.authService.getUser()?.username ?? 'Unknown';
  }

  loadReviews(): void {
    this.reviewService.getPendingReviews().subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      (error) => {
        this.errorMessage = 'Failed to load reviews';
      }
    );
  }

  approveReview(reviewId: number): void {
    const postReviewDto = { 
      id: reviewId,  // Add the review ID here
      approvedStatus: true, 
      feedback: this.getFeedback(reviewId) // Set the feedback from the textarea
    };
  
    this.reviewService.updateReviewStatus(reviewId, postReviewDto).subscribe(
      () => {
        this.loadReviews(); // Reload the reviews after approval
      },
      (error) => {
        this.errorMessage = 'Failed to approve review';
      }
    );
  }
  
  rejectReview(reviewId: number): void {
    const postReviewDto = { 
      id: reviewId,  // Add the review ID here
      approvedStatus: false,
      feedback: this.getFeedback(reviewId) // Set the feedback from the textarea
    };
  
    this.reviewService.updateReviewStatus(reviewId, postReviewDto).subscribe(
      () => {
        this.loadReviews(); // Reload the reviews after rejection
      },
      (error) => {
        this.errorMessage = 'Failed to reject review';
      }
    );
  }

  // Method to retrieve feedback from the review's textarea input
  getFeedback(reviewId: number): string {
    const review = this.reviews.find(r => r.id === reviewId);
    return review ? review.feedback || '' : '';
  }
}
