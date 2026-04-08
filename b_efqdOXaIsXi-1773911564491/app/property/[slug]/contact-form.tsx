"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/data";

interface ContactFormProps {
  propertyId?: number;
  propertyTitle: string;
  agentPhone?: string;
}

export function ContactForm({ propertyId, propertyTitle, agentPhone }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in "${propertyTitle}" and would like to schedule a viewing.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyId: propertyId ?? null,
        propertyTitle,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        message: formState.message,
        sourcePage: "property",
      }),
    });

    setIsSubmitting(false);
    if (response.ok) {
      setIsSubmitted(true);
    }
  };

  const handleWhatsApp = () => {
    const href = buildWhatsAppLink(
      agentPhone || "+212612345678",
      `Bonjour, je suis interesse par "${propertyTitle}". Pouvez-vous me contacter ?`
    );
    window.open(href, "_blank");
  };

  if (isSubmitted) {
    return (
      <div className="bg-secondary p-6 text-center">
        <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-4">
          <Send className="w-6 h-6 text-black" />
        </div>
        <h3 className="font-serif text-xl mb-2">Message sent</h3>
        <p className="text-muted-foreground text-sm">
          Thank you. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-6">
      <h3 className="font-serif text-xl mb-6">Send an inquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            className="w-full h-11 px-4 border border-border bg-white focus:outline-none focus:border-gold transition-colors text-sm"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formState.email}
            onChange={(event) => setFormState({ ...formState, email: event.target.value })}
            className="w-full h-11 px-4 border border-border bg-white focus:outline-none focus:border-gold transition-colors text-sm"
            placeholder="Your email"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formState.phone}
            onChange={(event) => setFormState({ ...formState, phone: event.target.value })}
            className="w-full h-11 px-4 border border-border bg-white focus:outline-none focus:border-gold transition-colors text-sm"
            placeholder="Your phone"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formState.message}
            onChange={(event) => setFormState({ ...formState, message: event.target.value })}
            className="w-full px-4 py-3 border border-border bg-white focus:outline-none focus:border-gold transition-colors resize-none text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-dark-button w-full h-12 font-medium text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send inquiry
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full h-12 bg-[#25D366] text-white font-medium text-sm tracking-wide uppercase hover:bg-[#20BA5A] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Contact on WhatsApp
        </button>
      </form>
    </div>
  );
}
