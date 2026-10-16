export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  research_topic: string;
  primary_question?: string;
  user_id: string;
  paper_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: string;
  project_id: string;
  doi?: string;
  title: string;
  abstract?: string;
  authors: string[];
  year?: number;
  venue?: string;
  citation_count?: number;
  source_url?: string;
  pdf_url?: string;
  is_open_access: boolean;
  ingestion_status: 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';
  error_message?: string;
  extracted_findings?: Record<string, any>;
  created_at: string;
}

export interface Citation {
  paper_id: string;
  title: string;
  year?: number;
  doi?: string;
  page_number?: number;
  section_name?: string;
  excerpt: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations: Citation[];
  created_at: string;
}

export interface EvidenceItem {
  id: string;
  paper_title: string;
  page_number?: string;
  excerpt: string;
  evidence_type: 'SUPPORTING' | 'CONTRADICTING';
  is_explicit: 'EXPLICIT' | 'INFERRED';
}

export interface CandidateGap {
  id: string;
  title: string;
  category: string;
  description: string;
  confidence_score: number;
  evidence_strength: 'HIGH' | 'MEDIUM' | 'LOW';
  potential_question?: string;
  suggested_experiment?: string;
  evidence_items: EvidenceItem[];
}

export interface GapAnalysis {
  id: string;
  project_id: string;
  topic: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  summary?: string;
  candidate_gaps: CandidateGap[];
  created_at: string;
}

export interface PaperComparisonResult {
  paper_id: string;
  title: string;
  authors: string[];
  year?: number;
  objective: string;
  methodology: string;
  dataset: string;
  evaluation_metrics: string;
  results: string;
  limitations: string;
  future_work: string;
}
