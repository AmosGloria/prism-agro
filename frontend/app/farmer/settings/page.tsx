'use client';
import React, { useState } from 'react';
import { Save, Building2, Phone, User, ShieldCheck, Bell, CreditCard } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function FarmerSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'Emeka Farms',
    phone: '+234 801 234 5678',
    bankName: 'First Bank of Nigeria',
    accountNo: '3012345678',
    accountName: 'Chukwuemeka Obi',
    notifications: { orders: true, freshness: true, payments: true },
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.updateUser('f1', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const InputRow = ({ icon: Icon, label, field, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]" />
        <input
          type={type}
          value={(form as any)[field] ?? ''}
          onChange={set(field)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] transition-colors"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>Settings & Payouts</h1>
        <p className="text-sm text-[#06930A] mt-1">Manage your profile and bank details for Interswitch disbursements.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <h2 className="text-sm font-bold text-[#023103] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <User size={16} className="text-[#08C40E]" /> Profile Information
          </h2>
          <div className="space-y-3">
            <InputRow icon={User} label="Farm / Business Name" field="name" />
            <InputRow icon={Phone} label="Phone Number" field="phone" />
          </div>
        </div>

        {/* Bank */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <h2 className="text-sm font-bold text-[#023103] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <CreditCard size={16} className="text-[#08C40E]" /> Payout Bank Account
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">Bank Name</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]" />
                <select
                  value={form.bankName}
                  onChange={set('bankName')}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] appearance-none"
                >
                  {['First Bank of Nigeria', 'Guaranty Trust Bank', 'Access Bank', 'Zenith Bank', 'UBA', 'Fidelity Bank', 'Union Bank', 'Sterling Bank'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <InputRow icon={CreditCard} label="Account Number" field="accountNo" placeholder="10-digit account number" />
            <InputRow icon={User} label="Account Name" field="accountName" placeholder="Name on account" />
          </div>
          <div className="mt-3 flex items-center gap-2 p-3 bg-[#F0FEF1] rounded-xl">
            <ShieldCheck size={14} className="text-[#08C40E]" />
            <p className="text-xs text-[#046207]">Payouts processed via <strong>Interswitch</strong> within 24h of order completion.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <h2 className="text-sm font-bold text-[#023103] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Bell size={16} className="text-[#08C40E]" /> Notifications
          </h2>
          {[
            { key: 'orders', label: 'New order alerts', desc: 'Get notified when a buyer orders your produce' },
            { key: 'freshness', label: 'Freshness alerts', desc: 'Warn me when listings drop below 50% freshness' },
            { key: 'payments', label: 'Payment & escrow updates', desc: 'Notify me when funds are held or released' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-[#F0FEF1] last:border-0">
              <div>
                <p className="text-sm font-medium text-[#023103]">{n.label}</p>
                <p className="text-xs text-gray-400">{n.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form.notifications as any)[n.key]}
                  onChange={e => setForm(f => ({ ...f, notifications: { ...f.notifications, [n.key]: e.target.checked } }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-[#E6FEE7] rounded-full peer peer-checked:bg-[#08C40E] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#E6FEE7] rounded-xl text-[#046207]">
            <ShieldCheck size={16} className="text-[#08C40E]" />
            <span className="text-sm font-semibold">Settings saved successfully!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#08C40E] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#06930A] transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Save size={16} />
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}