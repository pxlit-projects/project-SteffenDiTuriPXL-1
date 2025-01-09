package be.pxl.services.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReviewDto implements Serializable {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("authorName")
    private String authorName;

    @JsonProperty("createdDate")
    private String createdDate;

    @JsonProperty("approvedStatus")
    private boolean approvedStatus;

    @JsonProperty("feedback")
    private String feedback;
}
