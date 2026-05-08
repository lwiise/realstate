"use client";

import { useState } from "react";
import type { Locale } from "@/lib/cms-types";

interface SiteContactFormProps {
  sourcePage: string;
  submitLabel: string;
  locale?: Locale;
}

export function SiteContactForm({ sourcePage, submitLabel, locale = "fr" }: SiteContactFormProps) {
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
  const text = {
    sentTitle: locale === "en" ? "Message sent" : "Message envoye",
    sentBody: locale === "en"
      ? "Thank you. Our team will contact you shortly."
      : "Merci. Notre equipe vous recontactera rapidement.",
    firstName: locale === "en" ? "First name" : "Prenom",
    lastName: locale === "en" ? "Last name" : "Nom",
    email: "Email",
    phone: locale === "en" ? "Phone" : "Telephone",
    message: "Message",
    messagePlaceholder: locale === "en" ? "Describe your request..." : "Decrivez votre demande...",
    sending: locale === "en" ? "Sending..." : "Envoi...",
  };

  if (isSubmitted) {
    return (
      <div className="rounded-md border border-border bg-secondary px-6 py-8 text-center">
        <h3 className="font-serif text-2xl text-foreground">{text.sentTitle}</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          {text.sentBody}
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
            {text.firstName}
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
            {text.lastName}
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
          {text.email}
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
          {text.phone}
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
          {text.message}
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={formState.message}
          onChange={handleChange("message")}
          className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:border-gold transition-colors resize-none"
          placeholder={text.messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cta-dark-button w-full h-14 font-medium text-sm tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? text.sending : submitLabel}
      </button>
    </form>
  );
}
