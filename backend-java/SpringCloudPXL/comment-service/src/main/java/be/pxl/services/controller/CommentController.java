package be.pxl.services.controller;

import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.request.CommentUpdateRequest;
import be.pxl.services.services.CommentService;
import be.pxl.services.services.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin(origins = "http://localhost:4200")  // Allow requests from Angular on port 4200
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentDto> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("{postId}")
    public List<CommentDto> getComments(@PathVariable String postId) {
        return commentService.getCommentsByPostId(Long.valueOf(postId));
    }

    @GetMapping("get/{commentId}")
    public CommentDto getCommentById(@PathVariable String commentId) {
        return commentService.getCommentById(Long.valueOf(commentId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        commentService.deleteComment(Long.valueOf(id));
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
        commentService.createComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateComment(@RequestBody CommentUpdateRequest commentDto) {
        commentService.updateComment(commentDto);
        return ResponseEntity.ok().build();
    }
}
