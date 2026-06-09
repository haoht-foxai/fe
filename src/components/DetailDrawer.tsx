import { useEffect, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type {
  DocumentDetail,
  ActionableTask,
  SuggestedStaff,
  StaffInfo,
  ResponsibilityAssignment,
} from '../types/document';

// ─── Error boundary ──────────────────────────────────

class DrawerErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(err: Error) { return { error: err.message }; }
  componentDidCatch(err: Error, info: ErrorInfo) { console.error('[DetailDrawer]', err, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="drawer-error">
          ⚠️ Lỗi hiển thị chi tiết: {this.state.error}
          <br />
          <small>Vui lòng thử lại hoặc chọn tài liệu khác.</small>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Helpers ────────────────────────────────────────

const fmtDate = (v: string | null | undefined) => {
  if (!v || v === 'null') return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('vi-VN');
};

const fmtDateTime = (v: string | null | undefined) => {
  if (!v || v === 'null') return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? v
    : d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const URGENCY_MAP: Record<string, { label: string; cls: string }> = {
  HIGH:   { label: '🔴 Khẩn cấp',   cls: 'dbadge-red'    },
  MEDIUM: { label: '🟡 Bình thường', cls: 'dbadge-orange' },
  LOW:    { label: '🟢 Thấp',        cls: 'dbadge-green'  },
  NORMAL: { label: '🔵 Bình thường', cls: 'dbadge-blue'   },
  URGENT: { label: '🔴 Khẩn cấp',   cls: 'dbadge-red'    },
};

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  HIGH:   { label: 'Cao',        cls: 'dbadge-red'    },
  MEDIUM: { label: 'Trung bình', cls: 'dbadge-orange' },
  LOW:    { label: 'Thấp',       cls: 'dbadge-green'  },
};

const RISK_MAP: Record<string, { label: string; cls: string }> = {
  HIGH:   { label: 'Cao',        cls: 'dbadge-red'    },
  MEDIUM: { label: 'Trung bình', cls: 'dbadge-orange' },
  LOW:    { label: 'Thấp',       cls: 'dbadge-green'  },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  ACTIVE:   { label: 'Đang hiệu lực', cls: 'dbadge-green'  },
  INACTIVE: { label: 'Hết hiệu lực',  cls: 'dbadge-gray'   },
  PENDING:  { label: 'Chờ xử lý',     cls: 'dbadge-orange' },
};

const badge = (map: Record<string, { label: string; cls: string }>, key: string | null | undefined) => {
  if (!key) return null;
  const entry = map[key] ?? { label: key, cls: 'dbadge-gray' };
  return <span className={`dbadge ${entry.cls}`}>{entry.label}</span>;
};

const initial = (name: string | null | undefined) =>
  name ? name.charAt(0).toUpperCase() : '?';

// ─── Sub-components ──────────────────────────────────

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section className="drawer-section">
      <div className="drawer-section-title">
        <span>{icon}</span> {title}
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="dinfo-row">
      <span className="dinfo-label">{label}</span>
      <span className="dinfo-value">{value ?? '—'}</span>
    </div>
  );
}

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const p = Math.round((value ?? 0) * 100);
  const cls = p >= 80 ? 'conf-high' : p >= 50 ? 'conf-mid' : 'conf-low';
  return (
    <div className="conf-row">
      <span className="conf-label">{label}</span>
      <div className="conf-track">
        <div className={`conf-fill ${cls}`} style={{ width: `${p}%` }} />
      </div>
      <span className="conf-pct">{p}%</span>
    </div>
  );
}

function StaffCard({ staff }: { staff: SuggestedStaff }) {
  return (
    <div className="staff-card">
      <div className="staff-avatar">{initial(staff.full_name)}</div>
      <div className="staff-info">
        <div className="staff-name">
          {staff.full_name}
          {staff.is_leader && <span className="staff-leader">Lãnh đạo</span>}
        </div>
        <div className="staff-pos">{staff.position_name} — {staff.department_name}</div>
        <div className="staff-company">{staff.company_name}</div>
        <div className="staff-contacts">
          {staff.email && <span>✉️ {staff.email}</span>}
          {staff.phone && <span>📞 {staff.phone}</span>}
        </div>
      </div>
    </div>
  );
}

function StaffInfoCard({ staff }: { staff: StaffInfo | null }) {
  if (!staff) return null;
  return (
    <div className="staff-card">
      <div className="staff-avatar">{initial(staff.full_name)}</div>
      <div className="staff-info">
        <div className="staff-name">
          {staff.full_name ?? '—'}
          {staff.is_leader && <span className="staff-leader">Lãnh đạo</span>}
        </div>
        <div className="staff-pos">{staff.position_name} — {staff.department_name}</div>
        <div className="staff-company">{staff.company_name}</div>
        <div className="staff-contacts">
          {staff.email && <span>✉️ {staff.email}</span>}
          {staff.phone && <span>📞 {staff.phone}</span>}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, idx }: { task: ActionableTask; idx: number }) {
  const suggested = task.suggested_staff ?? [];
  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-num">#{idx + 1}</span>
        <div className="task-badges">
          {badge(STATUS_MAP, task.status)}
          {badge(PRIORITY_MAP, task.priority)}
        </div>
        <div className="task-risk">
          <span className="task-risk-label">Nguy cơ ảo giác:</span>
          {badge(RISK_MAP, task.hallucination_risk)}
        </div>
      </div>

      <p className="task-name">{task.name}</p>

      {task.deadline && (
        <div className="task-deadline">
          📅 Deadline: <strong>{fmtDate(task.deadline)}</strong>
        </div>
      )}

      {task.description && <div className="task-desc">{task.description}</div>}

      {task.source_location?.section && (
        <div className="task-source">
          <span className="task-source-icon">📍</span>
          <em>{task.source_location.section}</em>
        </div>
      )}

      {task.confidence && (
        <div className="task-confidence">
          <div className="task-confidence-title">Độ tin cậy AI</div>
          <ConfidenceBar label="Trích xuất nhiệm vụ" value={task.confidence.task_extraction ?? 0} />
          <ConfidenceBar label="Khớp phòng ban"       value={task.confidence.department_match ?? 0} />
          <ConfidenceBar label="Khớp nhân sự"         value={task.confidence.staff_match ?? 0} />
        </div>
      )}

      {task.staff && (
        <div className="task-staff">
          <div className="task-staff-title">👤 Cán bộ phụ trách</div>
          <StaffInfoCard staff={task.staff} />
        </div>
      )}

      {!task.staff && suggested.length > 0 && (
        <div className="task-staff">
          <div className="task-staff-title">👥 Nhân sự đề xuất ({suggested.length})</div>
          {suggested.map((s) => <StaffCard key={s.id} staff={s} />)}
        </div>
      )}
    </div>
  );
}

function ResponsibilitySection({ items }: { items: ResponsibilityAssignment[] }) {
  const byStaff: Record<string, { staff: StaffInfo | null; rows: ResponsibilityAssignment[] }> = {};
  for (const item of items) {
    const key = item.staff_id ?? item.raw_name ?? 'unknown';
    if (!byStaff[key]) byStaff[key] = { staff: item.staff ?? null, rows: [] };
    byStaff[key].rows.push(item);
  }

  return (
    <>
      {Object.entries(byStaff).map(([key, { staff, rows }]) => (
        <div key={key} className="ua-person-block">
          {staff ? (
            <StaffInfoCard staff={staff} />
          ) : (
            <div className="ua-staff-mini">
              <div className="ua-staff-name">{rows[0]?.raw_name ?? '—'}</div>
              <div className="ua-staff-meta">Chưa xác định nhân sự</div>
            </div>
          )}
          <ul className="ua-assign-list">
            {rows.map((item, i) => (
              <li key={i} className="ua-assign-item">
                <div className="ua-assign-name">{item.name}</div>
                <div className="ua-assign-meta">
                  {item.authority_level && (
                    <span className="dbadge dbadge-blue">{item.authority_level}</span>
                  )}
                  {item.hallucination_risk && (
                    <span className={`dbadge ${RISK_MAP[item.hallucination_risk]?.cls ?? 'dbadge-gray'}`}>
                      Risk: {item.hallucination_risk}
                    </span>
                  )}
                  {item.source_location && (
                    <span className="ua-source-loc">
                      Tr.{item.source_location.page + 1} §{item.source_location.section}
                    </span>
                  )}
                </div>
                {(item.domains ?? []).length > 0 && (
                  <div className="ua-tags">
                    {item.domains.map((d, j) => <span key={j} className="ua-tag">{d}</span>)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function DrawerSkeleton() {
  return (
    <div className="drawer-skeleton">
      {[100, 60, 80, 45, 90, 70].map((w, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${w}%`, marginBottom: 12 }} />
      ))}
    </div>
  );
}

function DrawerContent({ detail }: { detail: DocumentDetail }) {
  const ds = detail.document_summary ?? {};
  const urgency = URGENCY_MAP[(ds as DocumentDetail['document_summary']).urgency] ?? { label: (ds as DocumentDetail['document_summary']).urgency ?? '', cls: 'dbadge-gray' };
  const status  = STATUS_MAP[(ds as DocumentDetail['document_summary']).status]   ?? { label: (ds as DocumentDetail['document_summary']).status ?? '', cls: 'dbadge-gray' };
  const tasks   = detail.actionable_tasks ?? [];
  const files   = detail.files ?? [];
  const responsibilities = detail.responsibility_assignments ?? [];
  const relations = detail.management_relations ?? [];
  const locations = detail.location_assignments ?? [];
  const actings   = detail.acting_arrangements ?? [];

  return (
    <>
      {/* Status row */}
      <div className="drawer-status-row">
        <span className={`dbadge ${status.cls}`}>{status.label}</span>
        <span className={`dbadge ${urgency.cls}`}>{urgency.label}</span>
        {ds.document_number && ds.document_number !== 'null' && (
          <span className="dbadge dbadge-blue">📋 {ds.document_number}</span>
        )}
      </div>

      {/* Document summary */}
      <Section icon="📄" title="Thông tin văn bản">
        <div className="dinfo-grid">
          <InfoRow label="Người gửi"     value={ds.sender    ?? '—'} />
          <InfoRow label="Người nhận"    value={ds.recipient ?? '—'} />
          <InfoRow label="Chủ đề"        value={ds.subject   ?? '—'} />
          <InfoRow label="Ngày văn bản"  value={fmtDate(ds.date)} />
          <InfoRow label="Ngày hiệu lực" value={ds.effective_date && ds.effective_date !== 'null' ? ds.effective_date : '—'} />
        </div>

        {ds.content && (
          <div className="dcontent-box">
            <div className="dcontent-label">Nội dung tóm tắt</div>
            <p className="dcontent-text">{ds.content}</p>
          </div>
        )}

        {(ds.key_points ?? []).length > 0 && (
          <div className="dkeypoints">
            <div className="dcontent-label">Điểm chính</div>
            <ul className="dkeypoints-list">
              {(ds.key_points ?? []).map((kp, i) => <li key={i}>{kp}</li>)}
            </ul>
          </div>
        )}
      </Section>

      {/* Files */}
      {files.length > 0 && (
        <Section icon="📁" title={`File đính kèm (${files.length})`}>
          {files.map((f, i) => (
            <div key={i} className="file-item">
              <span className="file-icon">
                {f.content_type === 'application/pdf' ? '📕' : '📄'}
              </span>
              <div className="file-info">
                <div className="file-name" title={f.name}>{f.name}</div>
                <div className="file-meta">
                  {f.content_type} · {(f.text_length ?? 0).toLocaleString('vi-VN')} ký tự
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Phân công nhiệm vụ */}
      {responsibilities.length > 0 && (
        <Section icon="👤" title={`Phân công nhiệm vụ (${responsibilities.length})`}>
          <ResponsibilitySection items={responsibilities} />
        </Section>
      )}

      {/* Actionable tasks */}
      {tasks.length > 0 && (
        <Section icon="✅" title={`Nhiệm vụ cần thực hiện (${tasks.length})`}>
          {tasks.map((task, i) => <TaskCard key={i} task={task} idx={i} />)}
        </Section>
      )}

      {/* Quan hệ quản lý */}
      {relations.length > 0 && (
        <Section icon="🏢" title={`Quan hệ quản lý (${relations.length})`}>
          <table className="ua-table">
            <thead>
              <tr><th>Lãnh đạo</th><th>Phòng / Ban</th><th>Quan hệ</th></tr>
            </thead>
            <tbody>
              {relations.map((rel, i) => (
                <tr key={i}>
                  <td>
                    <div className="ua-table-name">{rel.leader_staff?.full_name ?? rel.leader_raw_name}</div>
                    {rel.leader_staff?.position_name && (
                      <div className="ua-table-sub">{rel.leader_staff.position_name}</div>
                    )}
                  </td>
                  <td>{rel.department}</td>
                  <td><span className="dbadge dbadge-blue">{rel.relationship}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* Phân công địa bàn */}
      {locations.length > 0 && (
        <Section icon="📍" title={`Phân công địa bàn (${locations.length})`}>
          {locations.map((loc, i) => (
            <div key={i} className="ua-loc-row">
              <div className="ua-loc-name">{loc.staff?.full_name ?? loc.leader_raw_name}</div>
              <div className="ua-tags">
                {(loc.locations ?? []).map((l, j) => (
                  <span key={j} className="ua-tag ua-tag-loc">{l}</span>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Ủy quyền */}
      {actings.length > 0 && (
        <Section icon="🔄" title={`Ủy quyền / Quyền hạn (${actings.length})`}>
          {actings.map((act, i) => (
            <div key={i} className="ua-acting-card">
              <div className="ua-acting-name">{act.staff?.full_name ?? act.raw_name}</div>
              <div><span className="dbadge dbadge-orange">{act.role}</span></div>
              {act.condition && <p className="ua-acting-condition">{act.condition}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Audit */}
      {detail.audit && (
        <Section icon="🔍" title="Kiểm định AI">
          <div className="dinfo-grid">
            <InfoRow label="Mô hình AI"          value={detail.audit.model_version} />
            <InfoRow label="Thời gian phân tích" value={fmtDateTime(detail.audit.analyzed_at)} />
            <InfoRow label="Đã duyệt người"      value={detail.audit.human_reviewed ? '✅ Có' : '⏳ Chưa'} />
            <InfoRow label="Người duyệt"         value={detail.audit.reviewer ?? '—'} />
          </div>
          {detail.audit.review_notes && (
            <div className="dcontent-box" style={{ marginTop: 10 }}>
              <div className="dcontent-label">Ghi chú duyệt</div>
              <p className="dcontent-text">{detail.audit.review_notes}</p>
            </div>
          )}
        </Section>
      )}

      <div className="drawer-analysis-id">
        Analysis ID: <span>{detail.analysis_id}</span>
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────

interface Props {
  detail: DocumentDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function DetailDrawer({ detail, loading, error, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isOpen = loading || !!detail || !!error;

  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}
      <aside className={`detail-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="drawer-close" onClick={onClose}>← Đóng</button>
          <p className="drawer-header-sub">Chi tiết phân tích tài liệu</p>
        </div>

        <div className="drawer-body">
          {loading && (
            <>
              <div className="drawer-loading-msg">⏳ Đang tải chi tiết...</div>
              <DrawerSkeleton />
            </>
          )}
          {!loading && error && (
            <div className="drawer-error">⚠️ {error}</div>
          )}
          {!loading && detail && (
            <>
              <h2 className="drawer-doc-title">{detail.document_summary?.title}</h2>
              <DrawerErrorBoundary key={detail.analysis_id}>
                <DrawerContent detail={detail} />
              </DrawerErrorBoundary>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
