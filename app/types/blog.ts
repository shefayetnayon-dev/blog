export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  author: {
    displayName: string;
    id: string;
    url: string;
    image: {
      url: string;
    };
  };
  labels: string[];
  replies: {
    totalItems: string;
    selfLink: string;
  };
}