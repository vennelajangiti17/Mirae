import { X, Upload, Star, Download, Edit2, Trash2, File } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

interface Resume {
  id: string;
  fileName: string;
  tag: string;
  date: string;
  isPrimary: boolean;
}

export function ManageResumesModal({ onClose }: Props) {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      fileName: 'Alex_Chen_Frontend_2026.pdf',
      tag: 'Frontend',
      date: 'Oct 24, 2026',
      isPrimary: true,
    },
    {
      id: '2',
      fileName: 'Alex_Chen_General.pdf',
      tag: 'Full-Stack',
      date: 'Sept 10, 2026',
      isPrimary: false,
    },
  ]);

  const togglePrimary = (id: string) => {
    setResumes(resumes.map(r => ({
      ...r,
      isPrimary: r.id === id
    })));
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
            <h2 className="text-2xl font-bold text-[#000000]" style={{ fontFamily: 'var(--font-display)' }}>
              Manage Resumes
            </h2>
            <button
              onClick={onClose}
              className="text-[#FCA311] hover:text-[#fdb748] transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-[#E5E5E5] rounded-md p-8 text-center hover:border-[#FCA311] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[#14213D] mx-auto mb-3" />
                <button className="px-6 py-2 bg-[#FCA311] text-[#000000] rounded font-semibold hover:bg-[#fdb748] transition-all mb-2">
                  Upload Resume
                </button>
                <p className="text-xs text-[#73766A]">Max 5MB. PDF or DOCX only.</p>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#14213D] mb-3">Your Resumes</h3>

              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-[#E5E5E5] rounded-md p-4 hover:border-[#FCA311] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className="w-10 h-10 bg-[#E5E5E5] rounded flex items-center justify-center flex-shrink-0">
                      <File className="w-5 h-5 text-[#14213D]" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#000000] truncate mb-1">
                        {resume.fileName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#14213D] text-white text-xs rounded">
                          {resume.tag}
                        </span>
                        <span className="text-xs text-[#73766A]">{resume.date}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePrimary(resume.id)}
                        className="p-2 hover:bg-[#E5E5E5] rounded transition-colors"
                        title={resume.isPrimary ? 'Primary resume' : 'Set as primary'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            resume.isPrimary
                              ? 'fill-[#FCA311] text-[#FCA311]'
                              : 'text-[#E5E5E5]'
                          }`}
                        />
                      </button>
                      <button
                        className="p-2 hover:bg-[#E5E5E5] rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-[#14213D]" />
                      </button>
                      <button
                        className="p-2 hover:bg-[#E5E5E5] rounded transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4 text-[#14213D]" />
                      </button>
                      <button
                        className="p-2 hover:bg-[#E5E5E5] rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-[#E11D48]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
