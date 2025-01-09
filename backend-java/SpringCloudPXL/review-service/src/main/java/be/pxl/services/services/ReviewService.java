package be.pxl.services.services;

import be.pxl.services.domain.PostReviewDto;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    //private final NotificationClient notificationClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review giveFeedback(Long Id, boolean approved, String feedback) {
        Review reviewPost = reviewRepository.findById(Id).orElseThrow();
        reviewPost.setApprovedStatus(approved);
        reviewPost.setFeedback(feedback);
        reviewRepository.save(reviewPost);
        sendToPostService(reviewPost);
//        NotificationRequest notificationRequest = NotificationRequest.builder()
//                .content("Your post has been reviewed")
//                .sender("review-service")
//                .postId(String.valueOf(reviewPost.getId()))
//                .build();
        //notificationClient.sendNotification(notificationRequest);
        reviewRepository.delete(reviewPost);
        return reviewPost;
    }

    private void sendToPostService(Review review) {
        PostReviewDto reviewPostDTO = PostReviewDto.builder()
                .id(review.getId())
                .title(review.getTitle())
                .content(review.getContent())
                .authorName(review.getAuthorName())
                .createdDate(review.getCreatedDate().toString())
                .approvedStatus(review.isApprovedStatus())
                .feedback(review.getFeedback())
                .build();
        System.out.println("Sending reviewed post back: " + review.isApprovedStatus() + " " + review.getFeedback());
        rabbitTemplate.convertAndSend("review.to.post", reviewPostDTO);
    }
}
