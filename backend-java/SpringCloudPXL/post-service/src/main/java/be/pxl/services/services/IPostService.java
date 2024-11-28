package be.pxl.services.services;

import java.util.List;

import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.domain.Post;


public interface IPostService {
    void createPost(PostDto postDto);
    List<PostDto> getAllPosts();
    void deletePost(Long id);

}
