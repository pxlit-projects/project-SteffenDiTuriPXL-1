package be.pxl.services.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PostDto {

    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime createdDate;
    private boolean draft;
    private boolean approvedStatus;
    private String feedback;

    public boolean isApprovedStatus() {
        return approvedStatus;
    }
}
