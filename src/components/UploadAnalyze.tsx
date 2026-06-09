import { useState, useRef, useCallback } from 'react';
import { uploadAndAnalyze } from '../api/documents';
import type {
  QuickAnalyzeResult,
  StaffInfo,
  ResponsibilityAssignment,
} from '../types/document';

function StaffMiniCard({ staff }: { staff: StaffInfo }) {
  return (
    <div className="ua-staff-mini">
      <div className="ua-staff-name">{staff.full_name}</div>
      <div className="ua-staff-meta">{staff.position_name} · {staff.department_name}</div>
      <div className="ua-staff-contact">
        {staff.email && <span>✉ {staff.email}</span>}
        {staff.phone && <span>📞 {staff.phone}</span>}
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="ua-section">
      <button className="ua-section-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className="ua-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="ua-section-body">{children}</div>}
    </div>
  );
}

function ResultView({ result }: { result: QuickAnalyzeResult }) {
  const s = result.document_summary;

  const byStaff = result.responsibility_assignments.reduce<
    Record<string, { staff: StaffInfo; items: ResponsibilityAssignment[] }>
  >((acc, item) => {
    if (!acc[item.staff_id]) acc[item.staff_id] = { staff: item.staff, items: [] };
    acc[item.staff_id].items.push(item);
    return acc;
  }, {});

  const urgencyCls =
    s.urgency === 'URGENT' ? 'dbadge-red' : s.urgency === 'NORMAL' ? 'dbadge-blue' : 'dbadge-gray';

  return (
    <div className="ua-result">
      <div className="ua-result-header">
        <h2 className="ua-result-title">{s.title}</h2>
        <div className="ua-result-badges">
          {s.urgency && <span className={`dbadge ${urgencyCls}`}>{s.urgency}</span>}
          {s.status && (
            <span className={`dbadge ${s.status === 'ACTIVE' ? 'dbadge-green' : 'dbadge-gray'}`}>
              {s.status}
            </span>
          )}
          {s.document_number && (
            <span className="dbadge dbadge-gray">Số: {s.document_number}</span>
          )}
        </div>
        <div className="ua-result-id">ID: {result.analysis_id}</div>
      </div>

      {/* Tóm tắt */}
      <CollapsibleSection title="📄 Tóm tắt văn bản" defaultOpen>
        <div className="dinfo-grid">
          {s.sender && (
            <>
              <span className="dinfo-label">Đơn vị gửi</span>
              <span className="dinfo-val">{s.sender}</span>
            </>
          )}
          {s.recipient && (
            <>
              <span className="dinfo-label">Người nhận</span>
              <span className="dinfo-val">{s.recipient}</span>
            </>
          )}
          {s.date && (
            <>
              <span className="dinfo-label">Ngày</span>
              <span className="dinfo-val">{s.date}</span>
            </>
          )}
          {s.effective_date && (
            <>
              <span className="dinfo-label">Hiệu lực</span>
              <span className="dinfo-val">{s.effective_date}</span>
            </>
          )}
          {s.subject && (
            <>
              <span className="dinfo-label">Trích yếu</span>
              <span className="dinfo-val">{s.subject}</span>
            </>
          )}
        </div>
        {s.content && <p className="ua-content">{s.content}</p>}
        {s.key_points?.length > 0 && (
          <ul className="ua-keypoints">
            {s.key_points.map((kp, i) => (
              <li key={i}>{kp}</li>
            ))}
          </ul>
        )}
      </CollapsibleSection>

      {/* Phân công nhiệm vụ */}
      <CollapsibleSection
        title={`👤 Phân công nhiệm vụ (${result.responsibility_assignments.length})`}
        defaultOpen
      >
        {Object.values(byStaff).map(({ staff, items }) => (
          <div key={staff.id} className="ua-person-block">
            <StaffMiniCard staff={staff} />
            <ul className="ua-assign-list">
              {items.map((item, i) => (
                <li key={i} className="ua-assign-item">
                  <div className="ua-assign-name">{item.name}</div>
                  <div className="ua-assign-meta">
                    {item.authority_level && (
                      <span className="dbadge dbadge-blue">{item.authority_level}</span>
                    )}
                    {item.hallucination_risk && (
                      <span
                        className={`dbadge ${
                          item.hallucination_risk === 'LOW'
                            ? 'dbadge-green'
                            : item.hallucination_risk === 'HIGH'
                            ? 'dbadge-red'
                            : 'dbadge-orange'
                        }`}
                      >
                        Risk: {item.hallucination_risk}
                      </span>
                    )}
                    {item.source_location && (
                      <span className="ua-source-loc">
                        Tr.{item.source_location.page + 1} §{item.source_location.section}
                      </span>
                    )}
                  </div>
                  {item.domains?.length > 0 && (
                    <div className="ua-tags">
                      {item.domains.map((d, j) => (
                        <span key={j} className="ua-tag">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CollapsibleSection>

      {/* Nhiệm vụ hành động */}
      {result.actionable_tasks?.length > 0 && (
        <CollapsibleSection
          title={`✅ Nhiệm vụ hành động (${result.actionable_tasks.length})`}
          defaultOpen
        >
          {result.actionable_tasks.map((task, i) => (
            <div key={i} className="task-card">
              <div className="task-name">{task.name}</div>
              <div className="task-meta">
                {task.priority && (
                  <span
                    className={`dbadge ${
                      task.priority === 'HIGH'
                        ? 'dbadge-red'
                        : task.priority === 'MEDIUM'
                        ? 'dbadge-orange'
                        : 'dbadge-gray'
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
                {task.status && <span className="dbadge dbadge-blue">{task.status}</span>}
                {task.recurrence && <span className="dbadge dbadge-gray">{task.recurrence}</span>}
                {task.deadline && (
                  <span className="dbadge dbadge-orange">⏰ {task.deadline}</span>
                )}
              </div>
              {task.description && <p className="task-desc">{task.description}</p>}
              {task.staff && <StaffMiniCard staff={task.staff} />}
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Quan hệ quản lý */}
      {result.management_relations?.length > 0 && (
        <CollapsibleSection
          title={`🏢 Quan hệ quản lý (${result.management_relations.length})`}
        >
          <table className="ua-table">
            <thead>
              <tr>
                <th>Lãnh đạo</th>
                <th>Phòng / Ban</th>
                <th>Quan hệ</th>
              </tr>
            </thead>
            <tbody>
              {result.management_relations.map((rel, i) => (
                <tr key={i}>
                  <td>
                    <div className="ua-table-name">
                      {rel.leader_staff?.full_name ?? rel.leader_raw_name}
                    </div>
                    {rel.leader_staff?.position_name && (
                      <div className="ua-table-sub">{rel.leader_staff.position_name}</div>
                    )}
                  </td>
                  <td>{rel.department}</td>
                  <td>
                    <span className="dbadge dbadge-blue">{rel.relationship}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>
      )}

      {/* Phân công địa bàn */}
      {result.location_assignments?.length > 0 && (
        <CollapsibleSection
          title={`📍 Phân công địa bàn (${result.location_assignments.length})`}
        >
          {result.location_assignments.map((loc, i) => (
            <div key={i} className="ua-loc-row">
              <div className="ua-loc-name">
                {loc.staff?.full_name ?? loc.leader_raw_name}
              </div>
              <div className="ua-tags">
                {loc.locations.map((l, j) => (
                  <span key={j} className="ua-tag ua-tag-loc">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Ủy quyền */}
      {result.acting_arrangements?.length > 0 && (
        <CollapsibleSection
          title={`🔄 Ủy quyền / Quyền hạn (${result.acting_arrangements.length})`}
        >
          {result.acting_arrangements.map((act, i) => (
            <div key={i} className="ua-acting-card">
              <div className="ua-acting-name">
                {act.staff?.full_name ?? act.raw_name}
              </div>
              <div>
                <span className="dbadge dbadge-orange">{act.role}</span>
              </div>
              {act.condition && (
                <p className="ua-acting-condition">{act.condition}</p>
              )}
            </div>
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}

export function UploadAnalyze() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuickAnalyzeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.type === 'application/pdf');
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !names.has(f.name))];
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const submit = async () => {
    if (!files.length) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await uploadAndAnalyze(files);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fd-wrap">
      <div className="fd-card">
        <div className="fd-card-header">
          <h2>📤 Upload &amp; Phân tích văn bản</h2>
          <p>
            Tải lên file PDF để tóm tắt văn bản và đề xuất phân công nhiệm vụ cho các cán bộ
          </p>
        </div>

        <div className="fd-field">
          <label className="fd-label">Chọn file PDF</label>
          <div
            className={`fd-dropzone${dragging ? ' fd-dropzone-active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <span>
              📄 Kéo thả file PDF vào đây hoặc <b>click để chọn</b>
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>
        </div>

        {files.length > 0 && (
          <ul className="fd-filelist">
            {files.map((f) => (
              <li key={f.name}>
                <span>📄 {f.name}</span>
                <button onClick={() => removeFile(f.name)} className="fd-file-remove">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <div className="fd-error">{error}</div>}

        <button
          className="fd-btn"
          onClick={submit}
          disabled={loading || files.length === 0}
        >
          {loading ? '⏳ Đang phân tích...' : '🔍 Phân tích văn bản'}
        </button>
      </div>

      {result && <ResultView result={result} />}
    </div>
  );
}
