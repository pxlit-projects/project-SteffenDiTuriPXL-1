import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.css'
})
export class PostEditorComponent {
  post: Post = {
    id: 0, title: '', content: '', createdDate: new Date(), draft: false,
    authorName: '',
  };

  constructor(private postService: PostService) {}

  savePost(): void {
    if (this.post.id) {
      this.postService.updatePost(this.post.id, this.post).subscribe({
        next: () => alert('Post updated successfully!'),
        error: (err) => alert(err.message),
      });
    } else {
      this.postService.createPost(this.post).subscribe({
        next: () => alert('Post created successfully!'),
        error: (err) => alert(err.message),
      });
    }
  }
}