export enum PostStatus {
    Draft = 'Draft',
    Publish = 'Publish',
    AllPosts = 'AllPosts',  
  }

  export interface BlogPostResponse {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: string;
    tags: string; // If this is actually an array like ['tag', 'treat'], change this to: string[]
    readTime: string;
    seoTitle: string;
    seoDescription: string;
    status: 'Publish' | 'Draft' ; // You can expand this based on your app logic
    createdAt: string; // or Date, depending on how you handle it
    updatedAt: string; // or Date
    __v: number;
  }
  