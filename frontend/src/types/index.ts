// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  bio: string | null;
  skills: string | null;
  interests: string | null;
  profile_image: string | null;
  mode: 'builder' | 'hustler';
  created_at: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  bio?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  profile_image?: string | null;
}

export interface UserModeToggle {
  mode: 'hustler' | 'builder';
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Opportunity Types
export interface Opportunity {
  id: number;
  title: string;
  description: string;
  required_skills: string | null;
  bounty_amount: number | null;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  creator_id: number;
  created_at: string;
  deadline: string | null;
}

export interface OpportunityCreate {
  title: string;
  description: string;
  required_skills?: string[] | null;
  bounty_amount?: number | null;
  deadline?: string | null;
}

export interface OpportunityUpdate {
  title?: string;
  description?: string;
  required_skills?: string[] | null;
  bounty_amount?: number | null;
  status?: 'open' | 'in_progress' | 'completed' | 'closed';
  deadline?: string | null;
}

// Application Types
export interface Application {
  id: number;
  opportunity_id: number;
  applicant_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ApplicationCreate {
  message: string;
}

// Component Props Types
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export interface ModeBadgeProps {
  mode: string;
}

export interface UserCardProps {
  user: User;
}

export interface OpportunityCardProps {
  opportunity: Opportunity;
  onUpdate: () => void;
}

export interface ApplyModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export interface AuthModalProps {
  type: 'login' | 'signup';
  onClose: () => void;
}

export interface CreateOpportunityModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface DashboardNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}
