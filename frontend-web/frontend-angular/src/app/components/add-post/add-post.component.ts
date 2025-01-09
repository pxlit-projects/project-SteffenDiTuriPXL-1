import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  title: string = '';
  content: string = '';
  draft: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  authorName: string = '';
  userName: string;

  constructor(private postService: PostService, private router: Router, private authService: AuthService) {
    // Get the username from the AuthService
    this.userName = this.authService.getUser()?.username ?? 'Unknown'; 
    this.authorName = this.userName;
  }

  onSubmit(): void {
    const newPost: Post = {
      title: this.title,
      content: this.content,
      authorName: this.authorName, 
      draft: this.draft,
    };

    this.postService.createPost(newPost).subscribe(
      (response) => {
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error creating post:', error);
      }
    );
  }
}
