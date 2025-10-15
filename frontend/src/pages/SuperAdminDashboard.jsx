// Add at the top, after other useState declarations
import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import EmailTemplatesManager from '../components/dashboard/EmailTemplatesManager';

const SuperAdminDashboard = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [newSettingKey, setNewSettingKey] = useState('');
  const [newSettingValue, setNewSettingValue] = useState('');
  const [settingValueEdits, setSettingValueEdits] = useState({}); 
  useEffect(() => {
    const fetchUsersAndSettings = async () => {
      try {
        const [usersRes, settingsRes] = await Promise.all([
          api.get('/admin/users', { headers: { Authorization: `Bearer ${auth.token}` } }),
          api.get('/admin/settings', { headers: { Authorization: `Bearer ${auth.token}` } })
        ]);
        setUsers(usersRes.data.data);
        setSettings(settingsRes.data.data);      } catch {
        toast.error('Failed to load users or settings');
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndSettings();
  }, [auth.token]);

  const handleRoleChange = (userId, newRole) => {
    setPendingRoleChange({ userId, newRole });
    setShowConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    try {
      await api.patch(`/admin/users/${pendingRoleChange.userId}/role`, { role: pendingRoleChange.newRole }, { headers: { Authorization: `Bearer ${auth.token}` } });
      setUsers(users => users.map(u => u.id === pendingRoleChange.userId ? { ...u, role: pendingRoleChange.newRole } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setShowConfirm(false);
      setPendingRoleChange(null);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      await api.patch('/admin/settings', { key, value }, { headers: { Authorization: `Bearer ${auth.token}` } });
      setSettings(settings => settings.map(s => s.key === key ? { ...s, value } : s));
      setSettingValueEdits(edits => ({ ...edits, [key]: undefined }));
      toast.success('Setting updated');
    } catch {
      toast.error('Failed to update setting');
    }
  };

  const handleDeleteSetting = async (key) => {
    try {
      await api.delete(`/admin/settings/${key}`, { headers: { Authorization: `Bearer ${auth.token}` } });
      setSettings(settings => settings.filter(s => s.key !== key));
      toast.success('Setting deleted');
    } catch {
      toast.error('Failed to delete setting');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  // User search/filter
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">User Management</h2>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4 px-3 py-2 border rounded w-full max-w-md"
        />
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 mb-4 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 md:px-4 md:py-2">Name</th>
                <th className="px-2 py-2 md:px-4 md:py-2">Email</th>
                <th className="px-2 py-2 md:px-4 md:py-2">Role</th>
                <th className="px-2 py-2 md:px-4 md:py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-blue-50 transition">
                  <td className="px-2 py-2 md:px-4 md:py-2">{user.name}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2">{user.email}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2">{user.role}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="applicant">Applicant</option>
                      <option value="intern">Intern</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="hr_manager">HR Manager</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="btn btn-secondary">Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="btn btn-secondary">Next</button>
        </div>
        {/* Confirmation dialog for role change */}
        {showConfirm && pendingRoleChange && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Role Change</h3>
              <p>Are you sure you want to change this user's role to <b>{pendingRoleChange.newRole}</b>?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-secondary" onClick={() => { setShowConfirm(false); setPendingRoleChange(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmRoleChange}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">System Settings</h2>
        <form className="mb-4 flex gap-2" onSubmit={async e => {
          e.preventDefault();
          if (newSettingKey && newSettingValue) {
            await api.post('/admin/settings', { key: newSettingKey, value: newSettingValue }, { headers: { Authorization: `Bearer ${auth.token}` } });
            setNewSettingKey('');
            setNewSettingValue('');
            // Refresh settings list
            const settingsRes = await api.get('/admin/settings', { headers: { Authorization: `Bearer ${auth.token}` } });
            setSettings(settingsRes.data.data);
            toast.success('Setting added');
          }
        }}>
          <input type="text" placeholder="New setting key" value={newSettingKey} onChange={e => setNewSettingKey(e.target.value)} className="border rounded px-2 py-1" />
          <input type="text" placeholder="New setting value" value={newSettingValue} onChange={e => setNewSettingValue(e.target.value)} className="border rounded px-2 py-1" />
          <button type="submit" className="btn btn-primary">Add Setting</button>
        </form>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 md:px-4 md:py-2">Key</th>
                <th className="px-2 py-2 md:px-4 md:py-2">Value</th>
                <th className="px-2 py-2 md:px-4 md:py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(setting => (
                <tr key={setting.key}>
                  <td className="px-2 py-2 md:px-4 md:py-2">{setting.key}</td>
                  <td className="px-2 py-2 md:px-4 md:py-2">
                    <input
                      type="text"
                      value={settingValueEdits[setting.key] ?? setting.value}
                      onChange={e => setSettingValueEdits(edits => ({ ...edits, [setting.key]: e.target.value }))}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-2 flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSettingChange(setting.key, settingValueEdits[setting.key] ?? setting.value)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteSetting(setting.key)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8">
        <EmailTemplatesManager />
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
