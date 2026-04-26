"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const serviceOptions = [
  "Louer votre bien",
  "Confier la gestion locative de votre bien",
  "La gestion locative",
] as const;

interface ContactProjectFormProps {
  sourcePage: string;
}

export function ContactProjectForm({ sourcePage }: ContactProjectFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedService, setSelectedService] =
    useState<(typeof serviceOptions)[number] | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canContinue = Boolean(selectedService && message.trim());
  const canSubmit = Boolean(selectedService && message.trim() && name.trim() && phone.trim());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: `Option choisie : ${selectedService}\n\n${message.trim()}`,
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
      <div className="rounded-md border border-border bg-white p-8 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.25)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ff5a36]">
          Demande envoyee
        </p>
        <h3 className="mt-4 text-3xl font-semibold text-slate-800">
          Merci, notre equipe revient vers vous rapidement.
        </h3>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
          Votre projet a bien ete transmis. Nous allons vous recontacter avec un accompagnement
          adapte a votre besoin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
          Quel accompagnement recherchez-vous ?
        </h2>
      </div>

      {step === 1 ? (
        <div className="space-y-8">
          <div>
            <p className="text-xl font-semibold text-slate-800">Choisissez une option :</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {serviceOptions.map((option) => {
                const isSelected = selectedService === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedService(option)}
                    className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-base font-semibold transition-colors ${
                      isSelected
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-300 bg-white text-slate-800 hover:border-slate-500"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border ${
                        isSelected
                          ? "border-white bg-white/20"
                          : "border-slate-300 bg-transparent"
                      }`}
                    />
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <textarea
              id="project-message"
              rows={8}
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[250px] w-full rounded-sm border border-slate-300 bg-white px-5 py-4 text-lg text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-slate-500"
              placeholder="Decrivez votre projet immobilier"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Option selectionnee
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{selectedService}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Nom complet</span>
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-14 w-full rounded-sm border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none transition-colors focus:border-slate-500"
                placeholder="Votre nom"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Telephone</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-14 w-full rounded-sm border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none transition-colors focus:border-slate-500"
                placeholder="+212 ..."
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 w-full rounded-sm border border-slate-300 bg-white px-4 text-base text-slate-800 outline-none transition-colors focus:border-slate-500"
              placeholder="vous@exemple.com"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Votre message</span>
            <textarea
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full rounded-sm border border-slate-300 bg-white px-4 py-4 text-base text-slate-800 outline-none transition-colors focus:border-slate-500"
              placeholder="Ajoutez un detail utile pour notre equipe"
            />
          </label>
        </div>
      )}

      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.25)] md:grid-cols-2">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep(1)}
          className="inline-flex h-16 items-center justify-center gap-2 border-b border-slate-200 px-6 text-lg font-semibold uppercase tracking-[0.12em] text-slate-400 transition-colors disabled:cursor-default md:border-b-0 md:border-r"
        >
          <ArrowLeft className="h-4 w-4" />
          Precedent
        </button>

        {step === 1 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep(2)}
            className="inline-flex h-16 items-center justify-center gap-2 px-6 text-lg font-semibold uppercase tracking-[0.12em] text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex h-16 items-center justify-center gap-2 px-6 text-lg font-semibold uppercase tracking-[0.12em] text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
