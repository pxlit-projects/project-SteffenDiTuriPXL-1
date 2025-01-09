package be.pxl.services.queue;

import be.pxl.services.domain.PostReviewDto;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReviewListener {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewListener(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @RabbitListener(queues = "post.to.review")
    public void receivePostForReview(PostReviewDto postReviewDto) {
        System.out.println("Received PostReviewDto: " + postReviewDto);
        Review review = Review.builder()
                .id(postReviewDto.getId())
                .title(postReviewDto.getTitle())
                .content(postReviewDto.getContent())
                .authorName(postReviewDto.getAuthorName())
                .createdDate(LocalDateTime.parse(postReviewDto.getCreatedDate()))
                .approvedStatus(postReviewDto.isApprovedStatus())
                .feedback(postReviewDto.getFeedback())
                .build();
        System.out.println("Review entity created: " + review);
        reviewRepository.save(review);
        System.out.println("Post saved for review: " + review.getTitle());
    }
}

