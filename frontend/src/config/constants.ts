export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MODES = {
  HUSTLER: 'hustler',
  BUILDER: 'builder'
};

export const OPPORTUNITY_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CLOSED: 'closed'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};