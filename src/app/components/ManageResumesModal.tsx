import { X, Upload, Star, Download, Edit2, Trash2, File } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="manage-resumes-modal-title"
    >
      <motion.div
        id="global-overlay-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B132B]/65"
        style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.div
          id="manage-resumes-modal"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex max-h-[85vh] w-full max-w-[700px] flex-col overflow-hidden rounded-md border border-[#D4AF37] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E5E5] p-6">
            <h2
              id="manage-resumes-modal-title"
              className="text-2xl font-bold text-[#000000]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Manage Resumes
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-[#FCA311] transition-colors hover:text-[#fdb748]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <div className="cursor-pointer rounded-md border-2 border-dashed border-[#E5E5E5] p-8 text-center transition-colors hover:border-[#FCA311]">
                <Upload className="mx-auto mb-3 h-8 w-8 text-[#14213D]" />
                <button className="mb-2 rounded bg-[#FCA311] px-6 py-2 font-semibold text-[#000000] transition-all hover:bg-[#fdb748]">
                  Upload Resume
                </button>
                <p className="text-xs text-[#73766A]">Max 5MB. PDF or DOCX only.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mb-3 text-sm font-semibold text-[#14213D]">Your Resumes</h3>

              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-md border border-[#E5E5E5] p-4 transition-colors hover:border-[#FCA311]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-[#E5E5E5]">
                      <File className="h-5 w-5 text-[#14213D]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 truncate font-semibold text-[#000000]">
                        {resume.fileName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#14213D] px-2 py-1 text-xs text-white">
                          {resume.tag}
                        </span>
                        <span className="text-xs text-[#73766A]">{resume.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        onClick={() => togglePrimary(resume.id)}
                        className="rounded p-2 transition-colors hover:bg-[#E5E5E5]"
                        title={resume.isPrimary ? 'Primary resume' : 'Set as primary'}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            resume.isPrimary
                              ? 'fill-[#FCA311] text-[#FCA311]'
                              : 'text-[#E5E5E5]'
                          }`}
                        />
                      </button>
                      <button
                        className="rounded p-2 transition-colors hover:bg-[#E5E5E5]"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-[#14213D]" />
                      </button>
                      <button
                        className="rounded p-2 transition-colors hover:bg-[#E5E5E5]"
                        title="Rename"
                      >
                        <Edit2 className="h-4 w-4 text-[#14213D]" />
                      </button>
                      <button
                        className="rounded p-2 transition-colors hover:bg-[#E5E5E5]"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-[#E11D48]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
