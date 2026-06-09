import { useState, useEffect, useMemo } from 'react';
import { fetchStaffList } from '../api/staff';
import type { StaffMember } from '../types/document';

const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

// Màu avatar theo chữ cái đầu
const AVATAR_COLORS = [
  '#4f46e5', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#7c3aed', '#db2777', '#0284c7',
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

function StaffCard({ staff }: { staff: StaffMember }) {
  return (
    <div className="sl-card">
      <div
        className="sl-avatar"
        style={{ background: avatarColor(staff.full_name) }}
      >
        {initial(staff.full_name)}
      </div>
      <div className="sl-info">
        <div className="sl-name">{staff.full_name}</div>
        {staff.position && <div className="sl-position">{staff.position}</div>}
        <div className="sl-dept">{staff.department}</div>
        <div className="sl-unit">{staff.unit}</div>
        <div className="sl-contacts">
          {staff.email && (
            <a className="sl-contact" href={`mailto:${staff.email}`} title={staff.email}>
              ✉ {staff.email}
            </a>
          )}
          {staff.phone && (
            <a className="sl-contact" href={`tel:${staff.phone}`} title={staff.phone}>
              📞 {staff.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DeptGroup({
  dept,
  unit,
  members,
}: {
  dept: string;
  unit: string;
  members: StaffMember[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="sl-dept-group">
      <button className="sl-dept-header" onClick={() => setOpen((o) => !o)}>
        <div className="sl-dept-left">
          <span className="sl-dept-icon">🏢</span>
          <div>
            <div className="sl-dept-name">{dept}</div>
            <div className="sl-dept-unit">{unit}</div>
          </div>
        </div>
        <div className="sl-dept-right">
          <span className="sl-dept-count">{members.length} cán bộ</span>
          <span className="sl-dept-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="sl-dept-body">
          {members.map((s) => (
            <StaffCard key={s.id} staff={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStaffList()
      .then(setStaff)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.unit.toLowerCase().includes(q) ||
        (s.position ?? '').toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q)
    );
  }, [staff, search]);

  // Group by department_id
  const groups = useMemo(() => {
    const map: Record<string, { dept: string; unit: string; members: StaffMember[] }> = {};
    for (const s of filtered) {
      if (!map[s.department_id]) {
        map[s.department_id] = { dept: s.department, unit: s.unit, members: [] };
      }
      map[s.department_id].members.push(s);
    }
    return Object.entries(map).sort(([, a], [, b]) =>
      a.unit.localeCompare(b.unit, 'vi') || a.dept.localeCompare(b.dept, 'vi')
    );
  }, [filtered]);

  return (
    <div className="sl-wrap">
      {/* Header */}
      <div className="sl-topbar">
        <div className="sl-title-row">
          <h2 className="sl-title">👥 Danh sách cán bộ</h2>
          {!loading && (
            <span className="sl-total">
              {filtered.length} / {staff.length} cán bộ · {groups.length} phòng ban
            </span>
          )}
        </div>
        <div className="sl-search-wrap">
          <span className="sl-search-icon">🔍</span>
          <input
            className="sl-search"
            placeholder="Tìm theo tên, phòng ban, đơn vị, chức vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="sl-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="sl-loading">
          <div className="sl-spinner" />
          <span>Đang tải danh sách cán bộ...</span>
        </div>
      )}

      {!loading && error && (
        <div className="sl-error">⚠️ {error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="sl-empty">
          <div className="sl-empty-icon">👤</div>
          <div>{search ? `Không tìm thấy cán bộ nào khớp với "${search}"` : 'Không có dữ liệu'}</div>
        </div>
      )}

      {/* Groups */}
      {!loading && !error && groups.length > 0 && (
        <div className="sl-groups">
          {groups.map(([deptId, { dept, unit, members }]) => (
            <DeptGroup key={deptId} dept={dept} unit={unit} members={members} />
          ))}
        </div>
      )}
    </div>
  );
}
