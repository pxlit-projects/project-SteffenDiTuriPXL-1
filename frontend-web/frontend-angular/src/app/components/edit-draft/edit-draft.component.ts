import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-draft',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-draft.component.html',
  styleUrl: './edit-draft.component.css'
})
export class EditDraftComponent {
  postId: number = NaN;  // Default to NaN to handle undefined case
  post: Post = { id: 0, title: '', content: '', draft: true, authorName: '', createdDate: new Date() };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];  // Convert to number
      if (this.postId) {  // Ensure it's a valid number
        this.loadPost(this.postId);
      } else {
        this.errorMessage = 'Invalid post ID';
      }
    });
  }

  loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe(
      (post) => {
        this.post = post;
      },
      (error) => {
        this.errorMessage = 'Failed to load the post';
      }
    );
  }

  onSubmit(): void {
    this.postService.updatePost(this.post).subscribe(
      () => {
        this.successMessage = 'Draft updated successfully';
        this.router.navigate(['/draft-posts']);  // Redirect to the draft posts page
      },
      (error) => {
        this.errorMessage = 'Failed to update draft';
      }
    );
  }
}
