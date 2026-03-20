"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "Aurum a securise un appartement waterfront avant sa mise sur le marche public. L'accompagnement a ete precis, discret et tres rassurant jusqu'a la signature.",
    name: "Samira El Khoury",
    role: "Investisseur prive",
    focus: "Appartement | Acheter",
  },
  {
    quote:
      "Nous cherchions une villa familiale en location longue duree avec un niveau de finition irreprochable. L'equipe a compris le brief des le premier rendez-vous.",
    name: "Nabil Tazi",
    role: "Directeur general",
    focus: "Villa | Louer",
  },
  {
    quote:
      "Pour notre retreat executif, nous avions besoin d'un lieu fort, flexible et impeccable. La recommandation d'Aurum a transforme l'experience de tout l'evenement.",
    name: "Lea Marchand",
    role: "Fondatrice studio evenementiel",
    focus: "Commercial | Location journaliere",
  },
  {
    quote:
      "Leur lecture du marche local nous a fait gagner un temps considerable. Les biens proposes etaient pertinents, bien negocies et parfaitement alignes avec notre strategie.",
    name: "Rachid Benali",
    role: "Family office advisor",
    focus: "Bureau | Acheter",
  },
];

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 5500);

    return () => window.clearInterval(interval);
  }, [api]);

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-end">
          <div className="max-w-xl">
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-4">
              La voix de nos clients
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Des experiences discretes,
              <br />
              fluides et memorables
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Chaque transaction est accompagnee avec le meme niveau de rigueur, de clarte et
              de sens du detail. Voici comment nos clients decrivent l'experience Aurum.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="border border-border bg-secondary p-4">
                <p className="font-serif text-3xl text-gold mb-1">98%</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Repeat clients
                </p>
              </div>
              <div className="border border-border bg-secondary p-4">
                <p className="font-serif text-3xl text-gold mb-1">24h</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  First shortlist
                </p>
              </div>
              <div className="border border-border bg-secondary p-4">
                <p className="font-serif text-3xl text-gold mb-1">5.0</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Client rating
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="ml-0">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.name} className="pl-0 pr-4 md:basis-[78%] xl:basis-[68%]">
                    <article
                      className={cn(
                        "relative h-full min-h-[380px] overflow-hidden border bg-black text-white p-8 md:p-10 transition-all duration-500",
                        current === index
                          ? "border-gold/50 shadow-[0_35px_80px_-45px_rgba(212,175,55,0.75)]"
                          : "border-white/10 opacity-80"
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_38%)]" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

                      <div className="relative flex h-full flex-col">
                        <div className="flex items-center justify-between gap-4 mb-10">
                          <div className="flex items-center gap-1 text-gold">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <Star key={starIndex} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <Quote className="w-10 h-10 text-gold/70" />
                        </div>

                        <p className="font-serif text-2xl md:text-3xl leading-tight text-white mb-10">
                          “{testimonial.quote}”
                        </p>

                        <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-lg font-medium text-white">{testimonial.name}</p>
                            <p className="text-sm text-white/60">{testimonial.role}</p>
                          </div>
                          <span className="inline-flex w-fit items-center border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.2em] text-gold/90">
                            {testimonial.focus}
                          </span>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      current === index ? "w-12 bg-gold" : "w-6 bg-black/15 hover:bg-black/30"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  className="flex h-12 w-12 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  className="flex h-12 w-12 items-center justify-center bg-black text-white transition-colors hover:bg-gold hover:text-black"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
