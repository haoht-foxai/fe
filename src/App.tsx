import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDocuments } from './hooks/useDocuments';
import { useDocumentDetail } from './hooks/useDocumentDetail';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { StatsBar } from './components/StatsBar';
import { Toolbar } from './components/Toolbar';
import { DocumentCard } from './components/DocumentCard';
import { DocumentTable } from './components/DocumentTable';
import { LoadingState } from './components/LoadingState';
import { Pagination } from './components/Pagination';
import { DetailDrawer } from './components/DetailDrawer';
import { FindDocument } from './components/FindDocument';
import { UploadAnalyze } from './components/UploadAnalyze';
import { StaffList } from './components/StaffList';
import type { ViewMode } from './types/document';

type Tab = 'list' | 'find' | 'upload' | 'staff';

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="tab-bar">
      <button
        className={`tab-btn ${active === 'list' ? 'tab-active' : ''}`}
        onClick={() => onChange('list')}
      >
        📋 Danh sách tài liệu
      </button>
      <button
        className={`tab-btn ${active === 'find' ? 'tab-active' : ''}`}
        onClick={() => onChange('find')}
      >
        🔎 Tìm số trích yếu
      </button>
      <button
        className={`tab-btn ${active === 'upload' ? 'tab-active' : ''}`}
        onClick={() => onChange('upload')}
      >
        📤 Upload &amp; Phân tích
      </button>
      <button
        className={`tab-btn ${active === 'staff' ? 'tab-active' : ''}`}
        onClick={() => onChange('staff')}
      >
        👥 Danh sách cán bộ
      </button>
    </div>
  );
}

function DocumentListTab({
  onLogout,
  activeTab,
}: {
  onLogout: () => void;
  activeTab: Tab;
}) {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');

  const {
    documents, offset, currentPage,
    loading, error, hasNext, hasPrev,
    nextPage, prevPage, refresh,
  } = useDocuments();

  const { detail, loading: detailLoading, error: detailError, selectedId, open, close } =
    useDocumentDetail();

  const filtered = useMemo(() => {
    if (!search.trim()) return documents;
    const q = search.toLowerCase();
    return documents.filter((d) => d.document_title.toLowerCase().includes(q));
  }, [documents, search]);

  // Khi chuyển tab khác, đóng drawer
  if (activeTab !== 'list') return null;

  return (
    <>
      <StatsBar documents={documents} filtered={filtered} currentPage={currentPage} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        onRefresh={refresh}
        loading={loading}
        resultCount={filtered.length}
        totalCount={documents.length}
      />

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <div className="error-text">
            <h3>Không thể tải dữ liệu</h3>
            <p>{error}</p>
          </div>
          <button className="btn-retry" onClick={refresh}>Thử lại</button>
        </div>
      )}

      {loading ? (
        <LoadingState count={5} />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>{search ? 'Không tìm thấy kết quả' : 'Không có tài liệu'}</h3>
          <p>
            {search
              ? `Không có tài liệu nào khớp với "${search}"`
              : 'Chưa có dữ liệu để hiển thị.'}
          </p>
        </div>
      ) : view === 'table' ? (
        <DocumentTable
          documents={filtered}
          offset={offset}
          onSelect={open}
          selectedId={selectedId}
        />
      ) : (
        <div className="document-grid">
          {filtered.map((doc, i) => (
            <DocumentCard
              key={doc.analysis_id}
              document={doc}
              index={offset + i}
              onSelect={open}
              selected={selectedId === doc.analysis_id}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={prevPage}
          onNext={nextPage}
          offset={offset}
          count={filtered.length}
        />
      )}

      <DetailDrawer
        detail={detail}
        loading={detailLoading}
        error={detailError}
        onClose={close}
      />
    </>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('list');

  return (
    <Layout loading={false} error={false} onLogout={onLogout}>
      <TabBar active={activeTab} onChange={setActiveTab} />
      <DocumentListTab onLogout={onLogout} activeTab={activeTab} />
      {activeTab === 'find' && <FindDocument />}
      {activeTab === 'upload' && <UploadAnalyze />}
      {activeTab === 'staff' && <StaffList />}
    </Layout>
  );
}

function App() {
  const { authed, login, logout, error, loading } = useAuth();

  if (!authed) {
    return <LoginPage onLogin={login} error={error} loading={loading} />;
  }

  return <Dashboard onLogout={logout} />;
}

export default App;
