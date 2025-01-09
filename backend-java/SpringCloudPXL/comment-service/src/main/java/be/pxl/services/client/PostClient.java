package be.pxl.services.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "post-service", url = "http://localhost:8081/api/post") // Replace URL with your PostService URL
public interface PostClient {

    @GetMapping("/{postId}")
    boolean postExists(@PathVariable Long postId); // Replace with the correct endpoint from your PostService
}
