import React, { useState } from 'react';
import { X, Send, CheckCircle2, User, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { propertyService } from '../services/api';

export default function InquiryModal({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry_type: 'Schedule a Tour',
    message: `Hello, I am interested in ${property?.title || 'this property'}. Please share more details or arrange a private tour.`
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentAgentEmail, setSentAgentEmail] = useState('');
  const [emailLinks, setEmailLinks] = useState({ mailtoUrl: '', gmailUrl: '' });
  const [error, setError] = useState(null);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetAgentEmail = property.agent_email || property.agent?.email || '';
    const subject = `[Client Inquiry] ${formData.inquiry_type} - ${property.title}`;
    const body = `Hello ${property.agent_name},\n\nI am interested in ${property.title} (${property.price_formatted}).\n\nClient Details:\n- Name: ${formData.name}\n- Email: ${formData.email}\n- Phone: ${formData.phone || 'Not provided'}\n- Inquiry Type: ${formData.inquiry_type}\n\nClient Message:\n${formData.message}\n\nListing Link: ${window.location.origin}/properties/${property.id}`;

    const mailtoUrl = targetAgentEmail ? `mailto:${targetAgentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';
    const gmailUrl = targetAgentEmail ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetAgentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';

    setEmailLinks({ mailtoUrl, gmailUrl });
    setSentAgentEmail(targetAgentEmail);

    try {
      const res = await propertyService.sendInquiry({
        property: property.id,
        ...formData
      });
      const resolvedAgentEmail = res?.agent_email || targetAgentEmail;
      setSentAgentEmail(resolvedAgentEmail);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Unable to send inquiry. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
            </div>
            
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600 block mb-1">
                Delivered
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                Inquiry Sent to Agent
              </h3>
              <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed font-light mt-1.5">
                Your message regarding <span className="font-medium text-stone-900">{property.title}</span> has been sent directly to listing agent <span className="font-medium text-stone-900">{property.agent_name}</span>.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 text-left text-xs max-w-sm mx-auto space-y-3">
              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-500">Agent Inbox:</span>
                <span className="text-amber-900 font-mono font-medium truncate">{sentAgentEmail}</span>
              </div>

              <div className="border-t border-stone-200/60 pt-2.5 space-y-2">
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  To send this directly from <strong>your personal email</strong> (so it appears in your <em>Sent</em> folder):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={emailLinks.gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-[11px] shadow-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send via Gmail Web</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                  <a
                    href={emailLinks.mailtoUrl}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-black text-stone-50 font-medium text-[11px] shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via Mail App</span>
                  </a>
                </div>
              </div>

              <p className="text-[10px] text-stone-400 font-light border-t border-stone-200/60 pt-2">
                A confirmation receipt has also been dispatched to your email (<strong>{formData.email}</strong>).
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-8 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                Private Consultation
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950 mt-0.5">
                Inquire About Property
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-light">
                {property.title} • {property.price_formatted}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                Inquiry Type
              </label>
              <select
                value={formData.inquiry_type}
                onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                className="w-full text-xs rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 focus:outline-none focus:border-stone-900"
              >
                <option value="Schedule a Tour">Schedule an In-Person Tour</option>
                <option value="Video Walkthrough">Request Virtual Video Tour</option>
                <option value="Pricing Inquiry">Pricing & Financing Details</option>
                <option value="General Question">General Information</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Suhani Beladiya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                Your Message
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs rounded-lg border border-stone-200 p-3 text-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-stone-900 hover:bg-black text-stone-50 font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <span>Sending inquiry...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request to {property.agent_name}</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
