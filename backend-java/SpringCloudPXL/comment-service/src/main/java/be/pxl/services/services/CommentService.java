package be.pxl.services.services;

import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.request.CommentUpdateRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import be.pxl.services.clients.PostClient;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    //private final RabbitTemplate rabbitTemplate;

    private final PostClient postClient;

    public CommentService(CommentRepository commentRepository, RabbitTemplate rabbitTemplate, PostClient postClient) {
        this.commentRepository = commentRepository;
        //this.rabbitTemplate = rabbitTemplate;
        this.postClient = postClient;
    }

    public List<CommentDto> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId).stream().map(comment -> CommentDto.builder()
                .id(String.valueOf(comment.getId()))
                .postId(String.valueOf(comment.getPostId()))
                .description(comment.getDescription())
                .authorName(comment.getAuthorName())
                .build()).toList();
    }

    public Comment createComment(CommentRequest commentRequest) {
        Long postId = Long.valueOf(commentRequest.getPostId());

        // Create a comment and save it
        Comment commentToSave = Comment.builder()
                .postId(Long.valueOf(commentRequest.getPostId()))
                .description(commentRequest.getDescription())
                .authorName(commentRequest.getAuthorName())
                .build();
        Comment savedComment = commentRepository.save(commentToSave);

        // Send a message to RabbitMQ to notify PostService for the update
        //rabbitTemplate.convertAndSend("comment.queue", savedComment);

        return savedComment;
    }


    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public void updateComment(CommentUpdateRequest commentUpdateRequest) {
        String id = commentUpdateRequest.getId();
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Comment ID cannot be null or empty");
        }

        Long commentId = Long.valueOf(id);  // Now it is safe to parse

        // Proceed with finding and updating the comment
        Comment commentToUpdate = commentRepository.findById(commentId)
                .orElseThrow(() -> new be.pxl.services.exceptions.CommentNotFoundException("Comment not found with ID: " + commentId));

        commentToUpdate.setDescription(commentUpdateRequest.getDescription());
        commentRepository.save(commentToUpdate);
    }


    public CommentDto getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id " + commentId));
        return mapToDto(comment);
    }

    public List<CommentDto> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return comments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private CommentDto mapToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(String.valueOf(comment.getId()));
        dto.setPostId(String.valueOf(comment.getPostId()));
        dto.setDescription(comment.getDescription());
        dto.setAuthorName(comment.getAuthorName());
        return dto;
    }
}
