'use client';
import React, { useState } from 'react';
import { Save, Truck, Phone, User, FileText, ShieldCheck } from 'lucide-react';

export default function LogisticsSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: 'Yemi FastTrack', phone: '+234 803 987 6543',
    vehicleType: 'Truck', vehiclePlate: 'ABC-123-XY',
    vehicleCapacity: '5000',
    licenseNo: 'DRV-2024-00123',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setLoading(false);
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#023103]" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
        <p className="text-sm text-[#06930A] mt-1">Update your vehicle documentation and NIN profile.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <h2 className="text-sm font-bold text-[#023103] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <User size={16} className="text-[#08C40E]" /> Driver Profile
          </h2>
          <div className="space-y-3">
            {[
              { icon: User, label: 'Full Name', field: 'name', placeholder: 'Your full name' },
              { icon: Phone, label: 'Phone Number', field: 'phone', placeholder: '+234...' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">{f.label}</label>
                <div className="relative">
                  <f.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]" />
                  <input value={(form as any)[f.field]} onChange={set(f.field)} placeholder={f.placeholder}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-2xl border border-[#E6FEE7] p-5">
          <h2 className="text-sm font-bold text-[#023103] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Truck size={16} className="text-[#08C40E]" /> Vehicle Details
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">Vehicle Type</label>
              <div className="relative">
                <Truck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]" />
                <select value={form.vehicleType} onChange={set('vehicleType')}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] appearance-none">
                  {['Motorcycle', 'Tricycle (Keke)', 'Van', 'Truck', 'Refrigerated Truck'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            {[
              { label: 'Plate Number', field: 'vehiclePlate', icon: FileText, placeholder: 'ABC-123-XY' },
              { label: 'Max Capacity (kg)', field: 'vehicleCapacity', icon: Truck, placeholder: '5000' },
              { label: "Driver's License No.", field: 'licenseNo', icon: ShieldCheck, placeholder: 'DRV-XXXX-XXXXX' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">{f.label}</label>
                <div className="relative">
                  <f.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]" />
                  <input value={(form as any)[f.field]} onChange={set(f.field)} placeholder={f.placeholder}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NIN status */}
        <div className="bg-[#F0FEF1] border border-[#CEFDCF] rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck size={22} className="text-[#08C40E] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#023103]">NIN Verified ✓</p>
            <p className="text-xs text-[#06930A]">Your National Identity Number has been verified. You are cleared to operate on FarmPrism.</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#E6FEE7] rounded-xl text-[#046207]">
            <ShieldCheck size={16} className="text-[#08C40E]" />
            <span className="text-sm font-semibold">Settings saved successfully!</span>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#08C40E] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#06930A] transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-display)' }}>
          <Save size={16} />
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}