import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  newCommentByPostId: { [postId: number]: string } = {}; // To store new comments for each post
  errorMessage = '';
  commentsByPostId: { [postId: number]: PostComment[] } = {};
  currentUser: { username: string; role: string } | null = null;

  @Input() set posts(value: Post[]) {
    this._posts = value;
    if (value.length > 0) {
      this.loadAllComments();
    }
  }
  get posts(): Post[] {
    return this._posts;
  }
  private _posts: Post[] = [];

  constructor(
    private commentService: CommentService,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (this.posts.length > 0) {
      this.loadAllComments();
    }
  }

  // In the component class
  goToEdit(comment: any): void {
    // Navigate to the edit comment page with the comment's ID
    this.router.navigate(['/edit-comment', comment.id]);
  }

  loadAllComments(): void {
    if (this.posts.length === 0) return;

    this.posts.forEach(post => {
      this.commentService.getCommentsByPostId(post.id).subscribe(
        (comments) => {
          this.commentsByPostId[post.id] = comments;
        },
        (error) => {
          console.error('Failed to load comments', error);
          this.errorMessage = 'Failed to load comments. Please try again.';
        }
      );
    });
  }

  deleteComment(comment: PostComment): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(comment.id).subscribe(
        () => {
          // Remove the comment from the local list
          const postComments = this.commentsByPostId[comment.postId];
          const index = postComments.findIndex(c => c.id === comment.id);
          if (index !== -1) {
            postComments.splice(index, 1);
          }
        },
        (error) => {
          console.error('Error deleting comment:', error);
          this.errorMessage = 'Failed to delete comment. Please try again.';
        }
      );
    }
  }

  addComment(post: Post): void {
    const newComment = this.newCommentByPostId[post.id]?.trim();
    if (!newComment) {
      alert('Comment cannot be empty.');
      return;
    }

    const commentData: PostComment = {
      id: 0, // This will be set by the backend
      postId: post.id,
      authorName: this.currentUser?.username || 'Anonymous',
      description: newComment,
    };

    this.commentService.addComment(commentData).subscribe(
      (savedComment) => {
        // Add the new comment to the local list
        this.commentsByPostId[post.id] = this.commentsByPostId[post.id] || [];
        this.commentsByPostId[post.id].push(savedComment);

        // Clear the new comment input
        this.newCommentByPostId[post.id] = '';
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.errorMessage = 'Failed to add comment. Please try again.';
      }
    );
  }

  editPost(post: Post): void {
    // Navigate to an edit page with the post's ID
    this.router.navigate(['/edit-draft', post.id]);
  }
  
  deletePost(post: Post): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe(
        () => {
          // Remove the post from the local list
          const index = this.posts.findIndex(p => p.id === post.id);
          if (index !== -1) {
            this.posts.splice(index, 1);
          }
        },
        (error) => {
          console.error('Error deleting post:', error);
          this.errorMessage = 'Failed to delete post. Please try again.';
        }
      );
    }
  }
  
}