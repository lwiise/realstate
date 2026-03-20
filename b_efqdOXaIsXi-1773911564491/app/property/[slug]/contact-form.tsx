"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

interface ContactFormProps {
  propertyTitle: string;
  agentPhone?: string;
}

export function ContactForm({ propertyTitle, agentPhone }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    message: `I'm interested in "${propertyTitle}" and would like to schedule a viewing.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleWhatsApp = () => {
    const phone = agentPhone ? agentPhone.replace(/\D/g, '') : "+212612345678";
    const message = encodeURIComponent(`Bonjour, Je suis intéressé par "${propertyTitle}". Pouvez-vous me contacter?`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="bg-secondary p-6 text-center">
        <div className="w-16 h-16 bg-gold mx-auto flex items-center justify-center mb-4">
          <Send className="w-6 h-6 text-black" />
        </div>
        <h3 className="font-serif text-xl mb-2">Message Envoyé</h3>
        <p className="text-muted-foreground text-sm">
          Merci de votre demande. Notre équipe vous contactera bientôt.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-6">
      <h3 className="font-serif text-xl mb-6">Envoyer une Demande</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Nom
          </label>
          <input
            type="text"
            id="name"
            required
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="w-full h-11 px-4 border border-border bg-white focus:outline-none focus:border-gold transition-colors text-sm"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formState.phone}
            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
            className="w-full h-11 px-4 border border-border bg-white focus:outline-none focus:border-gold transition-colors text-sm"
            placeholder="Votre téléphone"
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
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            className="w-full px-4 py-3 border border-border bg-white focus:outline-none focus:border-gold transition-colors resize-none text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-dark-button w-full h-12 font-medium text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Envoi..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer la Demande
            </>
          )}
        </button>
        
        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full h-12 bg-[#25D366] text-white font-medium text-sm tracking-wide uppercase hover:bg-[#20BA5A] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Contacter sur WhatsApp
        </button>
      </form>
    </div>
  );
}
