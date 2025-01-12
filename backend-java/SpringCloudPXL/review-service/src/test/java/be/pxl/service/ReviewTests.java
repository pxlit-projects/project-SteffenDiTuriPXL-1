package be.pxl.service;

import be.pxl.services.ReviewServiceApplication;
import be.pxl.services.domain.PostReviewDto;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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

@SpringBootTest(classes = ReviewServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class ReviewTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReviewRepository reviewRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer<>("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    // Prepare data before each test
    @BeforeEach
    void setUp() {
        Review review = Review.builder()
                .id(1L)
                .feedback("Looks good!")
                .approvedStatus(true)
                .createdDate(LocalDateTime.now())  // Manually set createdDate for test
                .build();
        reviewRepository.save(review);
    }



    @Test
    public void testGetAllReviews() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/review")
                        .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1)) // Assumes you have one review in the DB
                .andExpect(jsonPath("$[0].approvedStatus").value(true))
                .andExpect(jsonPath("$[0].feedback").value("Looks good!"));
    }

    @Test
    public void testUpdatePostReviewStatus() throws Exception {
        Long reviewId = 1L; // Assuming we have a review with ID 1

        PostReviewDto postReviewDto = PostReviewDto.builder()
                .approvedStatus(false)
                .feedback("Needs some changes")
                .build();

        String postReviewDtoJson = objectMapper.writeValueAsString(postReviewDto);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/review/{id}", reviewId)
                        .contentType("application/json")
                        .content(postReviewDtoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approvedStatus").value(false))
                .andExpect(jsonPath("$.feedback").value("Needs some changes"));
    }
}
