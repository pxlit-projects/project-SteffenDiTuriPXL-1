package be.pxl.service;

import be.pxl.services.CommentServiceApplication;
import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.request.CommentUpdateRequest;
import be.pxl.services.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = CommentServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class CommentTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer<>("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    void setUp() {
        // Clear the database before each test to ensure isolation
        commentRepository.deleteAll();
    }

    @Test
    public void testGetAllComments() throws Exception {
        // Arrange: Add a sample comment to the database
        CommentRequest commentRequest = new CommentRequest("1", "Test Comment", "Test Author");
        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());

        // Act & Assert: Verify the comment appears in the response
        mockMvc.perform(get("/api/comment")
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Test Comment"));
    }

    @Test
    public void testGetCommentsByPostId() throws Exception {
        // Arrange: Create a comment and associate it with a postId
        CommentRequest commentRequest = new CommentRequest("1", "Post specific comment", "Post Author");
        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());

        // Act & Assert: Check if comments for a specific postId are returned
        mockMvc.perform(get("/api/comment/{postId}", "1")
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Post specific comment"));
    }

    @Test
    public void testGetCommentById() throws Exception {
        // Arrange: Create a new comment request
        CommentRequest commentRequest = new CommentRequest("1", "Single comment", "Author");

        // Ensure the comment is created
        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());

        // Retrieve the comment by ID and verify its content
        mockMvc.perform(get("/api/comment/get/{commentId}", 1)
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Single comment"));
    }


    @Test
    public void testCreateComment() throws Exception {
        // Arrange: Create a new comment request
        CommentRequest commentRequest = new CommentRequest("1", "New Comment", "New Author");

        // Act & Assert: Ensure that the comment is created and the response status is 201
        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testCreateCommentMissingField() throws Exception {
        // Arrange: Create a comment request with a missing field (e.g., missing authorName)
        CommentRequest commentRequest = new CommentRequest("1", "New Comment", "");

        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testUpdateComment() throws Exception {
        // Arrange: Create a comment and then update it
        CommentRequest commentRequest = new CommentRequest("1", "Comment to update", "Initial Author");
        String createdCommentJson = objectMapper.writeValueAsString(commentRequest);

        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(createdCommentJson))
                .andExpect(status().isCreated());

        // Prepare an update request
        CommentUpdateRequest commentUpdateRequest = new CommentUpdateRequest("1", "Updated details");

        // Act & Assert: Verify the update
        mockMvc.perform(put("/api/comment/update")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentUpdateRequest)))
                .andExpect(status().isOk());

        // Verify the updated comment content
        mockMvc.perform(get("/api/comment/get/1")
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated comment"));
    }

    @Test
    public void testDeleteComment() throws Exception {
        // Arrange: Create a comment to be deleted
        CommentRequest commentRequest = new CommentRequest("1", "Comment to delete", "Delete Author");
        String commentJson = objectMapper.writeValueAsString(commentRequest);

        mockMvc.perform(post("/api/comment/create")
                        .contentType("application/json")
                        .content(commentJson))
                .andExpect(status().isCreated());

        // Act & Assert: Delete the comment
        mockMvc.perform(delete("/api/comment/delete/{id}", 1L))
                .andExpect(status().isAccepted());
    }
}
