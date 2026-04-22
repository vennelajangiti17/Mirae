import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react';
import { Navigate } from 'react-router';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';
import { BrandLogo } from './BrandLogo';

const features = [
  {
    icon: Sparkles,
    title: 'Elegant Pipeline Tracking',
    description:
      'Organize roles, applications, and next steps in a polished dashboard designed for focus.',
  },
  {
    icon: CalendarDays,
    title: 'Calendar-First Follow Ups',
    description:
      'See interviews, reminders, and deadlines in one place so momentum never slips.',
  },
  {
    icon: BarChart3,
    title: 'Insightful Progress Views',
    description:
      'Turn your search into a system with visibility into outcomes, bottlenecks, and wins.',
  },
  {
    icon: CheckCircle2,
    title: 'One-Click Capture',
    description:
      'Pair the app with the browser extension to save promising opportunities the moment you find them.',
  },
];

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const isLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.primary/.22),transparent_34%),radial-gradient(circle_at_80%_20%,theme(colors.card/.1),transparent_28%),radial-gradient(circle_at_bottom_right,theme(colors.primary/.14),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/30" />
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <section className="relative flex min-h-screen items-center justify-center px-6 py-16 sm:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-card px-4 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <BrandLogo className="h-10 w-10 sm:h-12 sm:w-12" />
              <div className="text-left">
                <div
                  className="text-lg font-bold leading-none text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Mirae
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Career Command Center
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#FFA007] sm:text-6xl lg:text-7xl">
                Track every opportunity with clarity, rhythm, and calm.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-secondary-foreground/78 sm:text-lg">
                Mirae brings your applications, follow-ups, resumes, analytics, and extension workflow
                into one refined space built to help you stay consistent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-10 flex w-full max-w-xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap"
            >
              <Button
                size="lg"
                className="min-w-[170px] flex-1 shadow-[0_14px_30px_rgba(0,0,0,0.22)] sm:flex-none"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[170px] flex-1 border-primary/35 bg-card text-foreground shadow-[0_14px_30px_rgba(0,0,0,0.14)] hover:bg-card sm:flex-none"
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="min-w-[170px] flex-1 border border-primary/20 shadow-[0_14px_30px_rgba(0,0,0,0.22)] sm:flex-none"
                asChild
              >
                <a
                  href="https://chrome.google.com/webstore"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add Extension
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="mt-6 text-sm text-secondary-foreground/68"
            >
              Seamless extension capture, elegant tracking, and a dashboard that keeps your search moving.
            </motion.p>
          </div>
        </section>
      </div>

      <section className="border-t border-border bg-background px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to run a thoughtful search.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Built with the same visual language as the product: crisp cards, strong hierarchy, and
              practical workflows that stay out of your way.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="border-border bg-card shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold text-card-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-6">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-px w-full bg-border" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary px-6 py-8 text-secondary-foreground sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-secondary-foreground/72 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8 w-8" />
            <span className="text-secondary-foreground">Mirae</span>
          </div>
          <span>Designed to keep your opportunity pipeline focused and organized.</span>
        </div>
      </footer>

      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}
