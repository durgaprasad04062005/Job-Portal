import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/jobs';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toggleId, setToggleId] = useState(null);
  const [toggleUser, setToggleUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ page, size: 15, role: roleFilter || undefined, keyword: search || undefined });
      const data = res.data.data;
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggle = async () => {
    try {
      await adminAPI.toggleUserStatus(toggleId);
      toast.success(`User ${toggleUser?.active ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const ROLE_COLORS = { STUDENT: 'badge-primary', EMPLOYER: 'badge-blue', ADMIN: 'badge-warning' };

  return (
    <DashboardLayout title="Manage Users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>All Users</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Manage platform users</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="search-bar">
              <Search size={15} style={{ color: 'var(--gray-400)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <select className="form-select" style={{ width: 'auto' }} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(0); }}>
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="EMPLOYER">Employers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner size="xl" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><h3>No users found</h3></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Email Verified</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                          {user.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${ROLE_COLORS[user.role] || 'badge-gray'}`}>{user.role}</span></td>
                    <td>
                      <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                        {user.active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.emailVerified ? 'badge-success' : 'badge-warning'}`}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => { setToggleId(user.id); setToggleUser(user); }}
                      >
                        {user.active ? <><UserX size={13} /> Block</> : <><UserCheck size={13} /> Unblock</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!toggleId}
        onClose={() => { setToggleId(null); setToggleUser(null); }}
        onConfirm={handleToggle}
        title={toggleUser?.active ? 'Block User' : 'Unblock User'}
        message={`Are you sure you want to ${toggleUser?.active ? 'block' : 'unblock'} ${toggleUser?.fullName}?`}
        confirmText={toggleUser?.active ? 'Block' : 'Unblock'}
        danger={toggleUser?.active}
      />
    </DashboardLayout>
  );
}
