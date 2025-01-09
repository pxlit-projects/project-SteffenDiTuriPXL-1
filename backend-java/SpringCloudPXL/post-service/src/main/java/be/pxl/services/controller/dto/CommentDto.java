package be.pxl.services.controller.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("postId")
    private String postId;

    @JsonProperty("desciption")
    private String description;

    @JsonProperty("authorName")
    private String authorName;

}

