package be.pxl.services.controller;

import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.controller.dto.PostReviewDto;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")  // Allow requests from Angular on port 4200
public class PostController {

    private final IPostService postService;

    @GetMapping
    public ResponseEntity getPosts() {
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/published")
    public ResponseEntity<List<PostDto>> getPublishedPosts() {
        List<PostDto> publishedPosts = postService.getPublishedPosts();
        return new ResponseEntity<>(publishedPosts, HttpStatus.OK);
    }

    @GetMapping("/reviewed")
    public ResponseEntity<List<PostReviewDto>> getReviewedPosts() {
        List<PostReviewDto> reviewedPosts = postService.getReviewedPosts();
        return new ResponseEntity<>(reviewedPosts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostRequest postRequest) {
        postService.createPost(postRequest);
        return new ResponseEntity<>("Post created successfully!", HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return new ResponseEntity<>("Post deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@RequestBody PostUpdateRequest postUpdateRequest) {
        try {
            postService.updatePost(postUpdateRequest);
            return new ResponseEntity<>("Post updated successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<PostDto>> filterPosts(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<PostDto> filteredPosts = postService.filterPosts(content, authorName, startDate, endDate);
        return new ResponseEntity<>(filteredPosts, HttpStatus.OK);
    }
}
