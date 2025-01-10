import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draft.component.html',
  styleUrl: './draft.component.css'
})
export class DraftComponent implements OnInit {
  draftPosts: Post[] = [];
  errorMessage: string | null = null;
  draft: boolean = false;

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDraftPosts();
  }

  loadDraftPosts(): void {
    this.postService.getDraftPosts().subscribe(
      (posts) => {
        this.draftPosts = posts;
      },
      (error) => {
        this.errorMessage = 'Failed to load draft posts';
      }
    );
  }

  saveDraft(post: Post): void {
    this.postService.updatePost(post).subscribe(
      (updatedPost) => {
        if (updatedPost) {
          const index = this.draftPosts.findIndex((p) => p.id === updatedPost.id);
          if (index !== -1) {
            this.draftPosts[index] = updatedPost;
          }
          this.router.navigate(['/drafts']);
        } else {
          // No update was returned, or it was null (possible error case)
          console.error('No post was returned from the update request');
          this.errorMessage = 'Failed to save draft due to server error';
        }
      },
      (error) => {
        // This block catches unexpected errors
        console.error('Error saving draft:', error);
        this.errorMessage = 'Failed to save draft';
      }
    );
  }
  
}
