package be.pxl.service;

import be.pxl.services.PostServiceApplication;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = PostServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class PostTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer<>("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @Test
    public void testCreatePost() throws Exception {
        Post post = Post.builder()
                .title("A casual post to get reviewed.")
                .content("Hopefully this will be approved...")
                .authorName("Steffen Di Turi")
                .draft(false)
                .build();

        String postString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postString))
                .andExpect(status().isCreated());

        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    public void testGetAllPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetPublishedPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetApprovedPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/approved"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRejectedPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/rejected"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetDraftPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/drafts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = postRepository.save(Post.builder()
                .title("Old Post")
                .content("Old content")
                .authorName("Steffen Di Turi")
                .draft(false)
                .createdDate(LocalDateTime.now()) // Set the createdDate
                .build());

        PostUpdateRequest postUpdateRequest = new PostUpdateRequest();
        postUpdateRequest.setTitle("Updated Post");
        postUpdateRequest.setContent("Updated content");

        String postUpdateString = objectMapper.writeValueAsString(postUpdateRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/{id}", post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postUpdateString))
                .andExpect(status().isOk());

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals("Updated Post", updatedPost.getTitle());
        assertEquals("Updated content", updatedPost.getContent());
    }


    @Test
    public void testDeletePost() throws Exception {
        Post post = postRepository.save(Post.builder()
                .title("Post to delete")
                .content("Content to delete")
                .authorName("Steffen Di Turi")
                .draft(false)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/post/{id}", post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value("Post deleted successfully!"));

        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    public void testDeletePostNotFound() throws Exception {
        Long id = 999L; // Declare id for consistency
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/post/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$").value("Post with ID " + id + " not found."));
    }


    @Test
    public void testFilterPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/filter")
                        .param("content", "review")
                        .param("authorName", "Steffen Di Turi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
