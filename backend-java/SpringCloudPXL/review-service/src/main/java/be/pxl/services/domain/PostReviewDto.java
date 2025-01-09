package be.pxl.services.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReviewDto {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private String createdDate;
    private boolean approvedStatus;
    private String feedback;
}
