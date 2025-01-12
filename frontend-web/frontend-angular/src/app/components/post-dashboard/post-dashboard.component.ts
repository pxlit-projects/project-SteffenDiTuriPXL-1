import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostListComponent } from "../post-list/post-list.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-dashboard',
  standalone: true,
  imports: [PostListComponent, CommonModule],
  templateUrl: './post-dashboard.component.html',
  styleUrl: './post-dashboard.component.css'
})
export class PostDashboardComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  userName: string = ''; 
  errorMessage: string = '';
  filterQuery: string = '';
  postIds: number[] = [];  // Add this new property
  currentUser: { username: string; role: string } | null = null;


  constructor(private postService: PostService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPosts();
    this.currentUser = this.authService.getUser();
  }

  setFilteredPosts(posts: Post[]) {
    this.filteredPosts = posts;
    this.postIds = posts.map(post => post.id).filter(id => id !== undefined) as number[];
  }

  loadPosts(): void {
    this.postService.getApprovedPosts().subscribe(
      (posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
      },
      (error) => {
        this.errorMessage = 'Failed to load posts';
      }
    );
  }

  onFilterChange(event: any): void {
    this.filterQuery = event.target.value;
    this.filterPosts();
  }

  filterPosts(): void {
    if (this.filterQuery) {
      const query = this.filterQuery.toLowerCase(); // Normalize the query to lowercase for comparison
      this.filteredPosts = this.posts.filter(post => {
        const dateString = post.createdDate
          ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(post.createdDate))
          : ''; // Format the date as "January 12"
        
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.authorName?.toLowerCase().includes(query) ||
          dateString.toLowerCase().includes(query) // Check against the formatted date
        );
      });
    } else {
      this.filteredPosts = this.posts;
    }
  }
  

  /* filterPosts(): void {
    if (this.filterQuery) {
      this.filteredPosts = this.posts.filter(post =>
        post.title.toLowerCase().includes(this.filterQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(this.filterQuery.toLowerCase()) ||
        post.authorName?.toLowerCase().includes(this.filterQuery.toLowerCase())
        || post.createdDate?.toDateString().includes(this.filterQuery.toLowerCase())
        
      );
    } else {
      this.filteredPosts = this.posts;
    }
  } */

  onAddPost(): void {
    this.router.navigate(['/add-post']);
  }
}
