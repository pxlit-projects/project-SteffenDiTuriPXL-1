package be.pxl.services.client;

import org.springframework.cloud.openfeign.FeignClient;


@FeignClient(name = "post-service", url = "http://localhost:8081/api/post")
public interface PostClient {

}

