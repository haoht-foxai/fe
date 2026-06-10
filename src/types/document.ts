export interface DocumentSummary {
  analysis_id: string;
  company_id: string;
  document_title: string;
  document_number: string | null;
  document_date: string | null;
  file_count: number;
  created_at: string;
}

export type ViewMode = 'card' | 'table';

// ─── Detail types ────────────────────────────────────

export interface FileInfo {
  name: string;
  text_length: number;
  content_type: string;
}

export interface SuggestedStaff {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  is_leader: boolean;
  company_name: string;
  position_name: string;
  department_name: string;
}

export interface ActionableTask {
  name: string;
  type: string;
  status: string;
  deadline: string | null;
  priority: string;
  description: string;
  recurrence: string;
  hallucination_risk: string;
  suggested_action?: string;
  staff_match_status: string;
  raw_name?: string;
  collaborators?: string[];
  confidence: {
    staff_match: number;
    task_extraction: number;
    department_match: number;
  };
  source_location: {
    page: number;
    section: string;
  };
  suggested_staff?: SuggestedStaff[];
  staff?: StaffInfo;
}

export interface DocumentSummaryDetail {
  date: string | null;
  title: string;
  sender: string | null;
  status: string;
  content: string;
  subject: string | null;
  urgency: string;
  recipient: string | null;
  key_points: string[];
  effective_date: string | null;
  document_number: string | null;
}

export interface FindDocumentResult {
  reference_number: string;
  found: boolean;
  filename: string | null;
  document_number: string | null;
  message: string | null;
}

export interface DocumentDetail {
  analysis_id: string;
  type: string;
  files?: FileInfo[];
  document_summary: DocumentSummaryDetail;
  actionable_tasks?: ActionableTask[];
  responsibility_assignments?: ResponsibilityAssignment[];
  management_relations?: ManagementRelation[];
  location_assignments?: LocationAssignment[];
  acting_arrangements?: ActingArrangement[];
  audit?: {
    reviewer: string | null;
    analyzed_at: string;
    review_notes: string | null;
    model_version: string;
    human_reviewed: boolean;
  };
  error: string | null;
}

// ─── Upload & Analyze types (POST quick-analyze) ──────

export interface StaffInfo {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  phone: string;
  department_id: string;
  department_name: string;
  position_id: string;
  position_name: string;
  company_id: string;
  company_name: string;
  is_leader: boolean;
  is_manager: boolean;
}

export interface ResponsibilityAssignment {
  type: string;
  name: string;
  staff_id: string;
  raw_name: string;
  domains: string[];
  authority_level: string;
  recurrence: string;
  reporting_cycle: string | null;
  report_to: string | null;
  collaborators: string[];
  source: string;
  source_location: { page: number; section: string };
  hallucination_risk: string;
  confidence: { staff_match: number; department_match: number; task_extraction: number };
  staff: StaffInfo | null;
  staff_match_status: string;
}

export interface ActionableTaskNew {
  type: string;
  name: string;
  description: string;
  staff_id: string;
  raw_name: string;
  priority: string;
  recurrence: string;
  deadline: string | null;
  status: string;
  collaborators: string[];
  source: string;
  hallucination_risk: string;
  source_location: { page: number; section: string };
  confidence: { staff_match: number; department_match: number; task_extraction: number };
  staff: StaffInfo;
  staff_match_status: string;
}

export interface ManagementRelation {
  leader_staff_id: string;
  leader_raw_name: string;
  department: string;
  relationship: string;
  collaborators: string[];
  leader_staff: StaffInfo;
}

export interface LocationAssignment {
  staff_id: string;
  leader_raw_name: string;
  locations: string[];
  leader_staff_id: string;
  leader_staff: StaffInfo;
  staff: StaffInfo;
}

export interface QuickAnalyzeResult {
  analysis_id: string;
  type: string;
  files: FileInfo[];
  document_summary: {
    title: string;
    document_number: string | null;
    date: string | null;
    effective_date: string | null;
    status: string;
    replaces_document: string | null;
    sender: string | null;
    recipient: string | null;
    subject: string | null;
    content: string;
    key_points: string[];
    urgency: string;
  };
  responsibility_assignments: ResponsibilityAssignment[];
  actionable_tasks: ActionableTaskNew[];
  management_relations: ManagementRelation[];
  location_assignments: LocationAssignment[];
  acting_arrangements: ActingArrangement[];
}

// ─── Staff list ───────────────────────────────────────

export interface StaffMember {
  id: string;
  full_name: string;
  position?: string;
  department: string;
  department_id: string;
  unit: string;
  email?: string;
  phone?: string;
}

export interface ActingArrangement {
  staff_id: string | null;
  raw_name: string;
  role: string;
  condition: string | null;
  leader_staff: StaffInfo | null;
  staff: StaffInfo | null;
}
