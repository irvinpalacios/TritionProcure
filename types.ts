
export enum Phase {
  IDLE = 0,
  SPEC_CHECK = 1,
  INVENTORY_CHECK = 2,
  COMPARISON = 3,
  COMPLIANCE = 4,
  FINISHED = 5,
  // Event Flow Phases
  EVENT_VENUE_CHECK = 6,
  EVENT_POLICY_GUIDANCE = 7,
  EVENT_SPEAKER_FORM = 8,
  EVENT_SPEAKER_FINALIZE = 9,
  // New Procurement Phase
  FUNDING_CHECK = 10
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  thoughtProcess?: string;
  timestamp: Date;
  actions?: string[];
  metadata?: any;
}

export interface Project {
  name: string;
  funder: string;
  grantId: string;
  utilization: number;
}

export interface ProjectInfo {
  user: string;
  projects: Project[];
}
