'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { LeadData } from '@/lib/types';

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
      className="mb-4 glass rounded-2xl p-6 border-[var(--maru-cyan)]/30"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[var(--maru-cyan)]">
          Let&#39;s Connect
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-gray-300 mb-4">
        Share your details and our team will reach out within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name <span className="text-[var(--maru-cyan)]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white placeholder-gray-500 transition-colors"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email <span className="text-[var(--maru-cyan)]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white placeholder-gray-500 transition-colors"
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white placeholder-gray-500 transition-colors"
            placeholder="Your company name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white placeholder-gray-500 transition-colors"
            placeholder="+27 XX XXX XXXX"
          />
        </div>

        {/* Interest */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-1">
            I&#39;m interested in
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white transition-colors"
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
          className="w-full bg-[var(--maru-cyan)] text-[var(--maru-dark)] py-3 rounded-lg font-semibold hover:bg-[var(--maru-cyan)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
