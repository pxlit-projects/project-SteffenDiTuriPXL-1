package be.pxl.services.services;

import be.pxl.services.client.ReviewClient;
import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.controller.dto.PostReviewDto;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.exception.PostException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository postRepository;
    private final ReviewClient reviewClient;


    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public List<PostDto> getAllPosts() {
        List<PostDto> allPosts = postRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return allPosts;
    }

    public List<PostDto> getApprovedPosts() {
        return postRepository.findApprovedPostsNative().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PostDto> getRejectedPosts() {
        return postRepository.findRejectedPostsNative().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PostDto> getDraftPosts() {
        return postRepository.findDraftPosts().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthorName(postRequest.getAuthorName());
        post.setDraft(postRequest.isDraft());
        post.setCreatedDate(LocalDateTime.now());
        post.setApprovedStatus(false);
        post.setFeedback("");

        postRepository.save(post);
        if (!postRequest.isDraft()) {
            sendToReview(post.getId());
        }
    }

    public void sendToReview(Long id) {
        Post post = postRepository.findById(id).orElseThrow();
        if (post.isDraft()) {
            throw new PostException("Unable to send post to review because the post is a draft.");
        } else {
            PostReviewDto postToSend = PostReviewDto.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .authorName(post.getAuthorName())
                    .createdDate(post.getCreatedDate().toString())
                    .feedback("")
                    .approvedStatus(false)
                    .build();
            rabbitTemplate.convertAndSend("post.to.review", postToSend);
            System.out.println("Post sent for approval: " + postToSend.getTitle());
        }
    }

    @Override
    public void deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Post with ID " + id + " not found.");
        }
    }

    @Override
    public void updatePost(Long id, PostUpdateRequest postUpdateRequest) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            post.setTitle(postUpdateRequest.getTitle());
            post.setContent(postUpdateRequest.getContent());
            post.setDraft(postUpdateRequest.isDraft());
            postRepository.save(post);

            postRepository.save(post);
            if (!postUpdateRequest.isDraft()) {
                sendToReview(post.getId());
            }
        } else {
            throw new IllegalArgumentException("Post with ID " + id + " not found.");
        }
    }


    @Override
    public List<PostDto> filterPosts(String content, String authorName, String startDate, String endDate) {
        return postRepository.findAll().stream()
                .filter(post -> content == null || post.getContent().contains(content))
                .filter(post -> authorName == null || post.getAuthorName().equalsIgnoreCase(authorName))
                .filter(post -> {
                    if (startDate == null || endDate == null) return true;
                    LocalDateTime start = LocalDateTime.parse(startDate);
                    LocalDateTime end = LocalDateTime.parse(endDate);
                    return post.getCreatedDate().isAfter(start) && post.getCreatedDate().isBefore(end);
                })
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getPublishedPosts() {
        return postRepository.findAll()
                .stream()
                .filter(post -> !post.isDraft()) // Filter alleen gepubliceerde posts
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthorName(post.getAuthorName());
        dto.setCreatedDate(post.getCreatedDate());
        dto.setDraft(post.isDraft());
        return dto;
    }

}
