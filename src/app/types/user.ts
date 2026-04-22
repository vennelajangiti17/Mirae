export interface SocialLink {
  id: string;
  platform: string;
  title: string;
  url: string;
  icon: 'linkedin' | 'github' | 'website' | 'behance' | 'dribbble' | 'twitter' | 'instagram';
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  resumeText: string;
  socialLinks: SocialLink[];
}
