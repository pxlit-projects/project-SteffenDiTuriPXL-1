package be.pxl.services.controller.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentUpdateRequest {

    private String id;
    private String description;
}
