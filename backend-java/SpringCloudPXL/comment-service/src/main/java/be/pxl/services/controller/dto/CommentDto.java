package be.pxl.services.controller.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {

    private String id;
    private String postId;

    private String description;
    private String authorName;

}
