import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const EmailTemplatesManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/admin/email-templates');
        setTemplates(res.data.data);
      } catch {
        toast.error('Failed to load email templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSave = async (id, subject, body) => {
    try {
      await api.put(`/admin/email-templates/${id}`, { subject, body });
      setTemplates(templates => templates.map(t => t.id === id ? { ...t, subject, body } : t));
      toast.success('Template updated');
    } catch {
      toast.error('Failed to update template');
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/admin/email-templates', newTemplate);
      toast.success('Template created');
      setNewTemplate({ name: '', subject: '', body: '' });
      setCreating(false);
      // Refresh templates
      const res = await api.get('/admin/email-templates');
      setTemplates(res.data.data);
    } catch {
      toast.error('Failed to create template');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/email-templates/${id}`);
      setTemplates(templates => templates.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Email Templates</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <button className="btn btn-primary w-full md:w-auto" onClick={() => setCreating(c => !c)}>
          {creating ? 'Cancel' : 'Add New Template'}
        </button>
      </div>
      {creating && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={e => setNewTemplate(nt => ({ ...nt, name: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="text"
            placeholder="Subject"
            value={newTemplate.subject}
            onChange={e => setNewTemplate(nt => ({ ...nt, subject: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
          <textarea
            placeholder="Body"
            value={newTemplate.body}
            onChange={e => setNewTemplate(nt => ({ ...nt, body: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
            rows={4}
          />
          <button className="btn btn-success mt-2 w-full md:w-auto" onClick={handleCreate}>
            Create Template
          </button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map(template => (
          <div key={template.id} className="mb-6 bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
            <input
              type="text"
              value={template.subject}
              onChange={e => setTemplates(ts => ts.map(t => t.id === template.id ? { ...t, subject: e.target.value } : t))}
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <textarea
              value={template.body}
              onChange={e => setTemplates(ts => ts.map(t => t.id === template.id ? { ...t, body: e.target.value } : t))}
              className="border rounded px-2 py-1 w-full mb-2"
              rows={5}
            />
            <div className="flex gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={() => handleSave(template.id, template.subject, template.body)}>
                Save
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(template.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplatesManager;
