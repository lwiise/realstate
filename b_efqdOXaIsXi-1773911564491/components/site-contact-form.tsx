"use client";

import { useState } from "react";

interface SiteContactFormProps {
  sourcePage: string;
  submitLabel: string;
}

export function SiteContactForm({ sourcePage, submitLabel }: SiteContactFormProps) {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange =
    (field: keyof typeof formState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${formState.firstName} ${formState.lastName}`.trim(),
        email: formState.email,
        phone: formState.phone,
        message: formState.message,
        sourcePage,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-md border border-border bg-secondary px-6 py-8 text-center">
        <h3 className="font-serif text-2xl text-foreground">Message sent</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you. Our team will come back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
          >
            First name
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={formState.firstName}
            onChange={handleChange("firstName")}
            className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
            placeholder="Jean"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={formState.lastName}
            onChange={handleChange("lastName")}
            className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
            placeholder="Dupont"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formState.email}
          onChange={handleChange("email")}
          className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
          placeholder="jean@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formState.phone}
          onChange={handleChange("phone")}
          className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-gold transition-colors"
          placeholder="+212 6 12-34-56-78"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={formState.message}
          onChange={handleChange("message")}
          className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-gold transition-colors resize-none"
          placeholder="Describe your request..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cta-dark-button w-full h-14 font-medium text-sm tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
