package be.pxl.services.controller;

import be.pxl.services.domain.PostReviewDto;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Allow all methods in this controller to be accessed from localhost:4200
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAll() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updatePostReviewStatus(@PathVariable Long id, @RequestBody PostReviewDto postReviewDto) {
        Review updatedReview = reviewService.giveFeedback(id, postReviewDto.isApprovedStatus(), postReviewDto.getFeedback());
        return ResponseEntity.ok(updatedReview);
    }

}

