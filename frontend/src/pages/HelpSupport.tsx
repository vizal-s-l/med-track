import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, BookOpen } from "lucide-react";

const HelpSupport = () => {
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
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Need assistance with Med Tracker? Find answers and get in touch with our support team.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Knowledge Base
          </h2>
          <p>
            Explore our documentation for step-by-step guides, feature overviews, and best practices. Start with account setup, medicine scheduling, and health metric logging tutorials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Live Chat
          </h2>
          <p>
            Chat with our support specialists Monday through Friday, 9 AM – 6 PM (local time). Access live chat from the app&apos;s help menu or the support widget on our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Contact Form
          </h2>
          <p>
            Submit the in-app support form with your request. We send all submissions to our support inbox configured in the environment settings and respond within one business day.
          </p>
        </section>
      </main>
      </div>
    </div>
  );
};

export default HelpSupport;
