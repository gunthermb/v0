import React, { useState } from "react";
import SubpageLayout from "@/components/site/SubpageLayout";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await base44.integrations.Core.SendEmail({
        to: "support@closetheoffer.com",
        subject: `New contact message from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubpageLayout label="Contact" title="Get in" italicWord="touch.">
      <p>
        Questions about pricing, features, or your account? Send us a message and
        we'll get back to you within one business day.
      </p>

      {sent ? (
        <div className="border border-accent/40 bg-accent/5 px-6 py-5 text-foreground">
          Thanks for reaching out — we've received your message and will reply shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {error && (
            <div className="border border-destructive/30 bg-destructive/5 px-5 py-3 text-destructive text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="mono-label block mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-hairline px-4 py-3 bg-background outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mono-label block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-hairline px-4 py-3 bg-background outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mono-label block mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-hairline px-4 py-3 bg-background outline-none text-foreground placeholder:text-muted-foreground resize-none"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-8 py-3.5 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending
              </>
            ) : (
              "Send message"
            )}
          </button>
        </form>
      )}
    </SubpageLayout>
  );
}