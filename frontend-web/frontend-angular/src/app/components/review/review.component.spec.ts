import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReviewComponent } from './review.component';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review.model';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockReviews: Review[] = [
    {
      id: 1, feedback: 'Test feedback 1', isApproved: false,
      title: '1',
      content: '1',
      authorName: 'testuser',
      createdDate: ''
    },
    {
      id: 2, feedback: 'Test feedback 2', isApproved: false,
      title: '2',
      content: '2',
      authorName: 'testuser',
      createdDate: ''
    }
  ];

  const mockUser = {
    username: 'testuser',
    role: 'admin',
  };

  beforeEach(async () => {
    // Create spy objects for services
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', [
      'getPendingReviews',
      'updateReviewStatus'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReviewComponent],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    // Default successful responses
    reviewService.getPendingReviews.and.returnValue(of(mockReviews));
    authService.getUser.and.returnValue(mockUser);

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component Initialization Tests
  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty reviews array', () => {
      expect(component.reviews).toBeDefined();
      expect(Array.isArray(component.reviews)).toBeTruthy();
    });

    it('should load reviews and set username on init', () => {
      expect(reviewService.getPendingReviews).toHaveBeenCalled();
      expect(component.reviews).toEqual(mockReviews);
      expect(component.userName).toBe('testuser');
    });

    it('should set username to Unknown if user is not found', () => {
      authService.getUser.and.returnValue(null);
      component.ngOnInit();
      expect(component.userName).toBe('Unknown');
    });
  });

  // LoadReviews Tests
  describe('loadReviews', () => {
    it('should load reviews successfully', () => {
      component.loadReviews();
      expect(component.reviews).toEqual(mockReviews);
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading reviews fails', () => {
      reviewService.getPendingReviews.and.returnValue(throwError(() => new Error('Error')));
      component.loadReviews();
      expect(component.errorMessage).toBe('Failed to load reviews');
    });
  });

  // ApproveReview Tests
  describe('approveReview', () => {
    it('should approve review successfully', fakeAsync(() => {
      const reviewId = 1;
      const postReviewDto = {
        id: reviewId,
        approvedStatus: true,
        feedback: 'Test feedback 1'
      };

      reviewService.updateReviewStatus.and.returnValue(of({} as Review));
      
      component.approveReview(reviewId);
      tick();

      expect(reviewService.updateReviewStatus).toHaveBeenCalledWith(reviewId, postReviewDto);
      expect(reviewService.getPendingReviews).toHaveBeenCalled();
      expect(component.errorMessage).toBe('');
    }));

    it('should handle error when approving review fails', fakeAsync(() => {
      const reviewId = 1;
      reviewService.updateReviewStatus.and.returnValue(throwError(() => new Error('Error')));
      
      component.approveReview(reviewId);
      tick();

      expect(component.errorMessage).toBe('Failed to approve review');
    }));
  });

  // RejectReview Tests
  describe('rejectReview', () => {
    it('should reject review successfully', fakeAsync(() => {
      const reviewId = 1;
      const postReviewDto = {
        id: reviewId,
        approvedStatus: false,
        feedback: 'Test feedback 1'
      };

      reviewService.updateReviewStatus.and.returnValue(of({} as Review));
      
      component.rejectReview(reviewId);
      tick();

      expect(reviewService.updateReviewStatus).toHaveBeenCalledWith(reviewId, postReviewDto);
      expect(reviewService.getPendingReviews).toHaveBeenCalled();
      expect(component.errorMessage).toBe('');
    }));

    it('should handle error when rejecting review fails', fakeAsync(() => {
      const reviewId = 1;
      reviewService.updateReviewStatus.and.returnValue(throwError(() => new Error('Error')));
      
      component.rejectReview(reviewId);
      tick();

      expect(component.errorMessage).toBe('Failed to reject review');
    }));
  });

  // GetFeedback Tests
  describe('getFeedback', () => {
    it('should return feedback for existing review', () => {
      const feedback = component.getFeedback(1);
      expect(feedback).toBe('Test feedback 1');
    });

    it('should return empty string for non-existent review', () => {
      const feedback = component.getFeedback(999);
      expect(feedback).toBe('');
    });
  });
});