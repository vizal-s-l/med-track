import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <img src="/favicon.ico" alt="Home" className="h-6 w-6" />
            <span className="text-base font-semibold">Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="py-12 px-4 sm:px-8">
      <main className="mx-auto w-full max-w-4xl space-y-10 text-foreground">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            These Terms of Service govern your access to and use of the Med Tracker application and related services.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
          <p>
            By creating an account or using the app, you agree to these Terms. If you do not agree, please discontinue use immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Eligibility</h2>
          <p>
            You must be at least 18 years old or have parental consent to use the service. You are responsible for ensuring compliance with local regulations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Account Responsibilities</h2>
          <p>
            Keep your login credentials secure, and promptly notify us of any unauthorized access. You are responsible for all activity under your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Permitted Use</h2>
          <p>
            You may use Med Tracker solely for personal health tracking. Reverse engineering, unauthorized access, or misuse of the service is prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Subscription & Fees</h2>
          <p>
            Paid plans, if offered, will be billed according to the plan terms. Fees are non-refundable except where required by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these Terms or engage in fraudulent activity. You may stop using the service at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            Med Tracker is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Updates will be posted in the app. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            For questions about these Terms, reach out via the support form within the app and our team will follow up.
          </p>
        </section>
      </main>
      </div>
    </div>
  );
};

export default TermsOfService;
