export interface Post {
    id?: number;           // Optional because the id is assigned after creation
    title: string;
    content: string;
    authorName?: string;   // Optional, if not provided, can be null
    draft: boolean;
    createdDate?: Date;  // Optional, will be assigned by the backend (or can be null)
  }
  