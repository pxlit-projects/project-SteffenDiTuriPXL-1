package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime createdDate;
    private boolean draft;
    private boolean approvedStatus;
    private String feedback;
}
