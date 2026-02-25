
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
  EVENT_SPEAKER_FINALIZE = 9,
  // New Procurement Phase
  FUNDING_CHECK = 10,
  // Tax Exemption Phases
  TAX_EXEMPTION_INIT = 11,
  TAX_EXEMPTION_Q1 = 12,
  TAX_EXEMPTION_Q2 = 13,
  // New Event Phases
  EVENT_FUNDING_CHECK = 14,
  EVENT_RENTAL_QUOTE = 15,
  EVENT_VALET_QUOTE = 16,
  EVENT_CATERING_CHECK = 17,
  // Commodity Phases
  COMMODITY_SOURCE = 18,
  COMMODITY_REFINE = 19,
  COMMODITY_CHECKOUT = 20
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
