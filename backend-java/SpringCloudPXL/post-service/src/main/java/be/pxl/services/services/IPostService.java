package be.pxl.services.services;

import java.util.List;

import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.controller.dto.PostReviewDto;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;


public interface IPostService {
    List<PostDto> getAllPosts();
    void deletePost(Long id);
    void createPost(PostRequest postRequest);
    void updatePost(PostUpdateRequest postUpdateRequest);
    List<PostDto> filterPosts(String content, String authorName, String startDate, String endDate);
    List<PostDto> getPublishedPosts();
    List<PostReviewDto> getReviewedPosts();
}
