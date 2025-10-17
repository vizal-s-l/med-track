import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            This Privacy Policy explains how Med Tracker collects, uses, and protects your personal information when you use our services.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as account details, health records, and medication data, as well as usage information generated through your interaction with the app.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Information</h2>
          <p>
            Your information is used to deliver core features, personalize reminders, improve our services, and communicate important updates. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Sharing & Disclosure</h2>
          <p>
            We share data only with trusted service providers who assist in delivering the app and are bound by confidentiality obligations. We may disclose information if required by law or to protect users and our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards to protect your data. Despite our efforts, no security system is impenetrable, so please use strong passwords and protect your devices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>
            You can access, update, or delete your personal information by managing your account settings or contacting our support team. Certain requests may require identity verification.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please reach out through the support form in the app and we&apos;ll respond promptly.
          </p>
        </section>
      </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
