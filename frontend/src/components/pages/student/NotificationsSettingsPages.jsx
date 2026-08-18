import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../../api/apis';
import { Bell, CheckCircle2, Shield, Lock, Smartphone, Moon, Sun, Save } from 'lucide-react';
import { Button, Badge, Spinner, Input } from '../../common/UIElements';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await notificationApi.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Notifications & Alerts</h1>
          <p className="text-xs text-slate-400">Updates regarding scheduled drives, tests, and AI feedback</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                  : 'bg-slate-900 border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{n.title}</span>
                <Badge variant={n.type === 'drive' ? 'emerald' : 'indigo'} size="sm">
                  {n.type}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Account Settings & Security</h1>
        <p className="text-xs text-slate-400">Manage password, multi-factor authentication, and notifications preferences</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <Input label="New Password" type="password" placeholder="••••••••" />
        </div>
        <div className="flex justify-end">
          <Button variant="primary" size="sm" icon={Save}>Update Password</Button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Platform Preferences</h3>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <p className="text-xs font-bold text-white">Email Notifications for New Drives</p>
            <p className="text-[11px] text-slate-400">Receive alerts when Tier-1 companies schedule campus drives</p>
          </div>
          <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
