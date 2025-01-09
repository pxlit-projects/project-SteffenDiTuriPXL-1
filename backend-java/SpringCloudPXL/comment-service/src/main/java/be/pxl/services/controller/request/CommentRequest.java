package be.pxl.services.controller.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {

    @NotBlank(message = "PostId is mandatory")
    private String postId;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotBlank(message = "Author is mandatory")
    private String authorName;

}
