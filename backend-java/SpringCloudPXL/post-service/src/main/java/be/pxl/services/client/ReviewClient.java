package be.pxl.services.client;

import be.pxl.services.controller.dto.PostReviewDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "review-service", url = "http://localhost:8081/api/review")
public interface ReviewClient {

    @GetMapping
    List<PostReviewDto> getAllReviews();
}

