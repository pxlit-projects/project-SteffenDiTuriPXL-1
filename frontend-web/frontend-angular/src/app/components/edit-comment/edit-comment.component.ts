import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostComment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.css'
})
export class EditCommentComponent implements OnInit {
  commentId: number = NaN;  // Default to NaN to handle undefined case
  comment: PostComment = {
    id: 0, description: '', authorName: '',
    postId: 0
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.comment.id = +params['commentId']; 
      if (this.commentId > 0) {
        this.loadPost(this.commentId);
      } else {
        this.errorMessage = 'Invalid comment ID';
      }
    });
  }  

  loadPost(commentId: number): void {
    this.commentService.getCommentById(commentId).subscribe(
      (comment) => {
        this.comment = comment;
      },
      (error) => {
        if (error.status === 404) {
          this.errorMessage = `Comment not found with ID: ${commentId}`;
        } else {
          this.errorMessage = 'Failed to load the post';
        }
      }
    );
  }

  onSubmit(): void {
    this.commentService.updateComment(this.comment).subscribe(
      () => {
        this.successMessage = 'Comment updated successfully';
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage = 'Failed to update comment';
      }
    );
  }
}
