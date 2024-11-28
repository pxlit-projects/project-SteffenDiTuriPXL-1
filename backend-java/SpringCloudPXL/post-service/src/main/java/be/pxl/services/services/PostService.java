package be.pxl.services.services;

import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{

    private final PostRepository postRepository;

    /*@Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }*/

    @Override
    public void createPost(PostDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        //post.setAuthor(postDto.getAuthor());
        postRepository.save(post);
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(post -> {
                    PostDto dto = new PostDto();
                    dto.setTitle(post.getTitle());
                    dto.setContent(post.getContent());
                    //dto.setAuthor(post.getAuthor());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Post with ID " + id + " not found.");
        }
    }

}
