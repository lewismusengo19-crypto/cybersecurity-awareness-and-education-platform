import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, HelpCircle, Check, MapPin } from 'lucide-react';
import { SAMPLE_FAQS } from '../sampleData';

export const ContactSection: React.FC = () => {
  const { language, translate, logActivity } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Contact Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logActivity('Contact Message', `Feedback submitted from: ${fullName} (${email})`);
    setSubmitted(true);
    setFullName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="space-y-12 text-left animate-fade-in" id="contact-section">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
          <Phone className="h-6 w-6 text-green-500" />
          <span>{translate('Help & Support Desk', 'Ubutumishi Bwa Bwafya')}</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {translate('Get in touch with local research coordinators or consult our Frequently Asked Questions (FAQ).', 'Lanshanyeni na ba coordinator besu.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Feedback Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="font-bold text-lg text-white">{translate('Research Project Contact', 'Ubutumishi Bwa Project')}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">PROJECT COORDINATOR EMAIL</span>
                  <a href="mailto:lewismusengo19@gmail.com" className="font-bold hover:underline hover:text-green-400">
                    lewismusengo19@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">SUPPORT PHONE</span>
                  <a href="tel:+260966500385" className="font-bold hover:underline hover:text-green-400">
                    +260 966 500385
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">LOCATION</span>
                  <span className="font-bold">Chinsali, Zambia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4">{translate('Send Us a Message', 'Kuti Mwatutumina Message')}</h3>

            {submitted ? (
              <div className="bg-green-550/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>{translate('Your message was submitted securely. Thank you!', 'Message yenu naifika. Natotela!')}</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Full Name', 'Ishina Lyenu')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Lewis Musengo"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Email Address', 'Inshila ya Email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lewismusengo19@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                    {translate('Your Question / Message', 'Ipusho Lyenu nangu Message')}
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={translate('I have a question about mobile money scam...', 'Ninkwatako ilipusho pali Mobile Money Scam...')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm shadow cursor-pointer transition-all"
                >
                  {translate('Submit Feedback', 'Tumeni Message')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-green-400" />
              <span>{translate('Frequently Asked Questions', 'Amepusho eyo abantu bepusha sana')}</span>
            </h3>

            <div className="space-y-4">
              {SAMPLE_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border-b border-slate-850 pb-3"
                  >
                    <button
                      id={`faq-toggle-${index}`}
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center py-2 text-left text-sm font-bold text-white hover:text-green-400 cursor-pointer focus:outline-none transition-colors"
                    >
                      <span>{translate(faq.question_en, faq.question_bm)}</span>
                      <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/20 p-3 rounded-lg border border-slate-850/60">
                        {translate(faq.answer_en, faq.answer_bm)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
