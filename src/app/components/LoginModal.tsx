import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    emailRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    window.localStorage.setItem('isLoggedIn', 'true');
    onClose();
    navigate('/dashboard', { replace: true });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="login-modal-title"
    >
      <motion.button
        type="button"
        aria-label="Close login modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-secondary/60 backdrop-blur-[40px]"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2
                id="login-modal-title"
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Login
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue into your application tracking workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close login modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="space-y-5 p-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-foreground">
                Email
              </label>
              <Input
                id="login-email"
                ref={emailRef}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-semibold text-foreground">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-11 bg-background"
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-destructive">{error}</p>
            ) : null}

            <Button type="submit" className="h-11 w-full">
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
