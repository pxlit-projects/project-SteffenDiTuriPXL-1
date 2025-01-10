export interface Review {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdDate: string;
    feedback: string; // Feedback will be editable in the UI
    isApproved: boolean; // Status of the review (approved or not)
  }
  