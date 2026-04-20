import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { notificationsAPI } from '../api/jobs';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const TYPE_ICONS = {
  APPLICATION_UPDATE: '📋',
  JOB_ALERT: '💼',
  SYSTEM: '⚙️',
  INTERVIEW: '🗓',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll({ page, size: 20 });
      const data = res.data.data;
      setNotifications(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [page]);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotif = async (id) => {
    await notificationsAPI.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout title="Notifications">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Notifications</h2>
            {unreadCount > 0 && (
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={48} color="var(--gray-300)" /></div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    background: notif.read ? 'var(--white)' : '#f0f4ff',
                    borderLeft: notif.read ? '3px solid transparent' : '3px solid var(--primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => !notif.read && markRead(notif.id)}
                >
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                      {TYPE_ICONS[notif.type] || '🔔'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: notif.read ? 500 : 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                          {notif.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          {!notif.read && (
                            <button className="btn btn-icon btn-secondary" style={{ padding: '0.25rem' }} onClick={e => { e.stopPropagation(); markRead(notif.id); }}>
                              <Check size={13} />
                            </button>
                          )}
                          <button className="btn btn-icon" style={{ padding: '0.25rem', color: 'var(--gray-400)', background: 'none' }} onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.375rem' }}>{notif.message}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
