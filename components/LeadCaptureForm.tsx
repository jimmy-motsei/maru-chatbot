'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { LeadData } from '@/lib/types';
import { COLORS } from '@/lib/constants';

interface LeadCaptureFormProps {
  onSubmit: (data: Partial<LeadData>) => void;
  onClose: () => void;
}

export default function LeadCaptureForm({ onSubmit, onClose }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit( formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-4 rounded-2xl p-6"
      style={{
        backgroundColor: COLORS.backgroundLight,
        border: `1px solid ${COLORS.accent}30`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: COLORS.accent }}>
          Let&#39;s Connect
        </h3>
        <button
          onClick={onClose}
          className="transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseEnter={(e) => e.currentTarget.style.color = COLORS.text}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm mb-4" style={{ color: '#d1d5db' }}>
        Share your details and our team will reach out within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#d1d5db' }}>
            Name <span style={{ color: COLORS.accent }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.maruDark,
              border: `1px solid #374151`,
              color: COLORS.text,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#d1d5db' }}>
            Email <span style={{ color: COLORS.accent }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.maruDark,
              border: `1px solid #374151`,
              color: COLORS.text,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1" style={{ color: '#d1d5db' }}>
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.maruDark,
              border: `1px solid #374151`,
              color: COLORS.text,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
            placeholder="Your company name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: '#d1d5db' }}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.maruDark,
              border: `1px solid #374151`,
              color: COLORS.text,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
            placeholder="+27 XX XXX XXXX"
          />
        </div>

        {/* Interest */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium mb-1" style={{ color: '#d1d5db' }}>
            I&#39;m interested in
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.maruDark,
              border: `1px solid #374151`,
              color: COLORS.text,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
          >
            <option value="">Select an option</option>
            <option value="lead-generation">Lead Generation Automation</option>
            <option value="sales-systems">Sales Systems Automation</option>
            <option value="office-automation">Office Operations Automation</option>
            <option value="whatsapp-solutions">WhatsApp Business Solutions</option>
            <option value="custom">Custom AI/Automation Solution</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: COLORS.accent,
            color: COLORS.maruDark,
          }}
          onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = COLORS.accentHover)}
          onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = COLORS.accent)}
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Sending...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
