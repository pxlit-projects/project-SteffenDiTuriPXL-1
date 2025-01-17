package be.pxl.services.queue;

import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.dto.PostReviewDto;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostListener {

    private final PostRepository postRepository;

    @Autowired
    public PostListener(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @RabbitListener(queues = "review.to.post")
    public void getReviewedPost(PostReviewDto postReviewDto) {
        Optional<Post> postOpt = postRepository.findById(postReviewDto.getId());

        if (postOpt.isEmpty()) {
            // Log the error or handle the empty case
            System.out.println("Post with ID {} not found");
            // Handle the case where the post is not found (return or throw a custom exception, for instance)
            return;  // Or you can throw a custom exception if needed
        }

        Post post = postOpt.get();  // Proceed with the post if it's found

        post.setApprovedStatus(postReviewDto.isApprovedStatus());
        post.setFeedback(postReviewDto.getFeedback());
        postRepository.save(post);
        System.out.println("Received reviewed post: " + postReviewDto.getTitle() + " - Approved: " + postReviewDto.isApprovedStatus());
    }

    @RabbitListener(queues = "comment.queue")
    public void receiveMessage(CommentDto commentDto) {
        Long postId = Long.valueOf(commentDto.getPostId());

        Post post = postRepository.findById(postId).orElseThrow();
        // add comment to post
        postRepository.save(post);

        System.out.println("Received comment: " + commentDto.getDescription() + " for post ID: " + postId);
    }
}

