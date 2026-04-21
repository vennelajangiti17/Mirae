import { motion } from 'motion/react';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ onClose, onConfirm }: Props) {
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
          className="bg-white rounded-md w-full max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-[100000]"
        >
          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#000000] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Are you sure you want to log out?
            </h2>
            <p className="text-sm text-[#73766A] mb-6">
              You will need to sign back in to access your tracking pipeline.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-[#14213D] font-semibold hover:text-[#FCA311] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-3 bg-[#FCA311] text-[#000000] rounded font-bold hover:bg-[#fdb748] transition-all shadow-md hover:shadow-lg"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
