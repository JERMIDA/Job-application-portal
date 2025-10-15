import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const SuperAdminSettings = () => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        setSettings(response.data.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to fetch settings');
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      await api.patch('/admin/settings', { key, value });
      setSettings(settings.map(s => (s.key === key ? { ...s, value } : s)));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast.error('Failed to update setting');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-grow w-full min-w-0 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Super Admin Settings</h1>
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse border border-gray-200 text-xs sm:text-xs md:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">Key</th>
                <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">Value</th>
                <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(setting => (
                <tr key={setting.key}>
                  <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">{setting.key}</td>
                  <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">
                    <input
                      type="text"
                      value={setting.value}
                      onChange={e => updateSetting(setting.key, e.target.value)}
                      className="border rounded px-2 py-1 w-full text-xs md:text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2">
                    <button
                      onClick={() => updateSetting(setting.key, setting.value)}cd
                      className="bg-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 text-xs md:text-sm"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="bg-gray-100 py-2 md:py-4 text-center text-gray-500 text-xs md:text-sm border-t w-full flex-shrink-0">
        &copy; {new Date().getFullYear()} DEBO Engineering. All rights reserved.
      </footer>
    </div>
  );
};

export default SuperAdminSettings;
