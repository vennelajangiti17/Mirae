import { X, Upload, Star, Download, Edit2, Trash2, File } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { authService } from '../services/authService'; // 👈 Import your service

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
  const fileInputRef = useRef<HTMLInputElement>(null); // 👈 For the hidden input
  const [isUploading, setIsUploading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      fileName: 'My_Resume.txt',
      tag: 'General',
      date: new Date().toLocaleDateString(),
      isPrimary: true,
    },
  ]);

  // Handle the actual file upload and AI sync
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. Read the text from the file
      // NOTE: For PDFs, you'd usually do this on the backend or use a PDF library.
      // For now, this works perfectly with .txt or .md files for testing!
      const text = await file.text(); 

      // 2. Send that text to your new MongoDB field
      await authService.updateResume(text);

      // 3. Update the UI list
      const newResume: Resume = {
        id: Math.random().toString(),
        fileName: file.name,
        tag: 'New Upload',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isPrimary: true,
      };

      setResumes([newResume, ...resumes.map(r => ({ ...r, isPrimary: false }))]);
      alert("✨ Resume uploaded and AI Profile updated!");

    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to update AI Profile. Is your backend running?");
    } finally {
      setIsUploading(false);
    }
  };

  const togglePrimary = (id: string) => {
    setResumes(resumes.map(r => ({
      ...r,
      isPrimary: r.id === id
    })));
    // In a real app, you'd also tell the backend which one is primary here.
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[2147483647]" aria-modal="true" role="dialog">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B132B]/65 backdrop-blur-[40px]"
      />

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex max-h-[85vh] w-full max-w-[700px] flex-col overflow-hidden rounded-md border border-[#D4AF37] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="flex items-center justify-between border-b border-[#E5E5E5] p-6">
            <h2 className="text-2xl font-bold text-[#000000]">Manage Resumes</h2>
            <button onClick={onClose} className="p-1 text-[#FCA311] hover:text-[#fdb748]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              {/* 🖱️ Clicking this div triggers the hidden input below */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition-colors 
                  ${isUploading ? 'border-gray-300 bg-gray-50' : 'border-[#E5E5E5] hover:border-[#FCA311]'}`}
              >
                <Upload className={`mx-auto mb-3 h-8 w-8 ${isUploading ? 'animate-bounce text-gray-400' : 'text-[#14213D]'}`} />
                
                {/* Hidden Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt,.pdf,.md" 
                  onChange={handleFileChange}
                />

                <button className="mb-2 rounded bg-[#FCA311] px-6 py-2 font-semibold text-[#000000] transition-all hover:bg-[#fdb748]">
                  {isUploading ? 'Processing AI Profile...' : 'Upload Resume'}
                </button>
                <p className="text-xs text-[#73766A]">Use a .txt or .pdf file. We'll extract the skills for your Match Score.</p>
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
                  className="rounded-md border border-[#E5E5E5] p-4 hover:border-[#FCA311]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#E5E5E5]">
                      <File className="h-5 w-5 text-[#14213D]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 truncate font-semibold text-[#000000]">{resume.fileName}</div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#14213D] px-2 py-1 text-xs text-white">{resume.tag}</span>
                        <span className="text-xs text-[#73766A]">{resume.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePrimary(resume.id)} className="rounded p-2 hover:bg-[#E5E5E5]">
                        <Star className={`h-4 w-4 ${resume.isPrimary ? 'fill-[#FCA311] text-[#FCA311]' : 'text-[#E5E5E5]'}`} />
                      </button>
                      <button className="rounded p-2 hover:bg-[#E5E5E5]"><Download className="h-4 w-4 text-[#14213D]" /></button>
                      <button className="rounded p-2 hover:bg-[#E5E5E5]"><Trash2 className="h-4 w-4 text-[#E11D48]" /></button>
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
