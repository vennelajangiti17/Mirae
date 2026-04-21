import { X, Plus, Edit2, Trash2, ExternalLink, Linkedin, Github, Globe, Dribbble, Twitter, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

interface SocialLink {
  id: string;
  platform: string;
  title: string;
  url: string;
  icon: 'linkedin' | 'github' | 'website' | 'behance' | 'dribbble' | 'twitter' | 'instagram';
}

const platformIcons = {
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  behance: Globe,
  dribbble: Dribbble,
  twitter: Twitter,
  instagram: Instagram,
};

export function SocialPortfolioModal({ onClose }: Props) {
  const [links, setLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'LinkedIn',
      title: 'Professional Profile',
      url: 'https://linkedin.com/in/alexchen',
      icon: 'linkedin',
    },
    {
      id: '2',
      platform: 'GitHub',
      title: 'Code Portfolio',
      url: 'https://github.com/alexchen',
      icon: 'github',
    },
    {
      id: '3',
      platform: 'Personal Website',
      title: 'Portfolio Site',
      url: 'https://alexchen.dev',
      icon: 'website',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLink = () => {
    if (newPlatform && newUrl) {
      const newLink: SocialLink = {
        id: Date.now().toString(),
        platform: newPlatform,
        title: newPlatform,
        url: newUrl,
        icon: 'website',
      };
      setLinks([...links, newLink]);
      setNewPlatform('');
      setNewUrl('');
      setShowAddForm(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <>
      {/* Full-screen Modal Scrim - Deep navy #0B132B at 60% opacity with 40px backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B] bg-opacity-60 z-[99999] flex items-center justify-center p-8"
        style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        {/* Modal Container - Centered with premium depth */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-md w-full max-w-[700px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-h-[85vh] overflow-hidden flex flex-col relative z-[100000]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between flex-shrink-0">
            <div>
              <h2
                className="text-3xl font-bold text-[#14213D] mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Your Online Portfolio
              </h2>
              <p className="text-sm text-[#14213D]/50" style={{ fontFamily: 'Outfit' }}>
                Showcase your professional presence across platforms
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#FCA311] hover:text-[#fdb748] transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Links List */}
            <div className="space-y-3 mb-6">
              {links.map((link, index) => {
                const IconComponent = platformIcons[link.icon];
                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative bg-white border border-[#E5E5E5] rounded-lg p-5 hover:border-[#FCA311] hover:shadow-lg transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(252, 163, 17, 0.02) 0%, rgba(255, 255, 255, 1) 100%)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Platform Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FCA311] to-[#fdb748] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Link Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#14213D]" style={{ fontFamily: 'Outfit' }}>
                            {link.platform}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-[#FCA311]/10 text-[#FCA311] rounded-full font-medium">
                            {link.title}
                          </span>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#14213D]/60 hover:text-[#FCA311] transition-colors flex items-center gap-1 truncate"
                          style={{ fontFamily: 'Outfit' }}
                        >
                          {link.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          className="p-2 hover:bg-[#FCA311]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-[#14213D]" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#E11D48]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add New Link Section */}
            <AnimatePresence mode="wait">
              {!showAddForm ? (
                <motion.button
                  key="add-button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-4 border-2 border-dashed border-[#3B82F6] rounded-lg text-[#3B82F6] hover:bg-[#3B82F6]/5 transition-all flex items-center justify-center gap-2 font-semibold group"
                  style={{ fontFamily: 'Outfit' }}
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add New Link
                </motion.button>
              ) : (
                <motion.div
                  key="add-form"
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="border-2 border-[#3B82F6] rounded-lg p-5 bg-[#3B82F6]/5 overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-[#14213D] mb-4" style={{ fontFamily: 'Outfit' }}>
                    Add New Link
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                        Platform / Title
                      </label>
                      <input
                        type="text"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        placeholder="e.g., LinkedIn, GitHub, Behance"
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#14213D]"
                        style={{ fontFamily: 'Outfit' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#14213D] mb-2" style={{ fontFamily: 'Outfit' }}>
                        Link URL
                      </label>
                      <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#14213D]"
                        style={{ fontFamily: 'Outfit' }}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddLink}
                        className="flex-1 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all font-semibold shadow-md"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Save Link
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowAddForm(false);
                          setNewPlatform('');
                          setNewUrl('');
                        }}
                        className="px-6 py-3 border-2 border-[#E5E5E5] text-[#14213D] rounded-lg hover:bg-[#E5E5E5] transition-all font-semibold"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
