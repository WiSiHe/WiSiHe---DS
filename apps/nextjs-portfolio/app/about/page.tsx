'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaChevronDown } from 'react-icons/fa';
import SkillsSection from '../components/SkillsSection/SkillsSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const journeyData = [
  {
    year: "The Beginning",
    title: "The Spark",
    content: "My journey started with a simple curiousity about how things work. What began as tinkering with HTML/CSS soon turned into a deep passion for building logic that creates visual impact.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
  },
  {
    year: "Evolution",
    title: "Logic meets Art",
    content: "I realized that code isn't just about functionality—it's a medium for expression. I started bridging my love for traditional painting with digital possibilities, exploring how development can be as expressive as a brushstroke.",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=1000"
  },
  {
    year: "Current Era",
    title: "Bridging Worlds",
    content: "Today, I specialize in creating immersive web experiences where 3D, performance, and storytelling collide. I'm constantly pushing the boundaries of what's possible in the browser.",
    image: "/wisihe.png"
  }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animations
    gsap.from('.hero-text', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power4.out'
    });

    gsap.to('.hero-bg', {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 200,
      opacity: 0
    });

    // Journey Sections
    const sections = gsap.utils.toArray('.journey-section');
    sections.forEach((section: any) => {
      const text = section.querySelector('.journey-text');
      const image = section.querySelector('.journey-image');

      gsap.from(text, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        x: -100,
        opacity: 0,
        ease: 'none'
      });

      gsap.from(image, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        x: 100,
        opacity: 0,
        scale: 0.8,
        ease: 'none'
      });
    });

    // Final Skills Section Entrance
    gsap.from('.skills-entrance', {
      scrollTrigger: {
        trigger: '.skills-entrance',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background text-foreground overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden border-b border-border/30">
        <div className="hero-bg absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,var(--color-accent-surface)_0%,transparent_70%)]" />
        </div>

        <div className="z-10 text-center max-w-5xl">
          <h1 className="hero-text text-6xl md:text-9xl font-black mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/40 leading-none uppercase">
            Story of <br /> WiSiHe
          </h1>
          <p className="hero-text text-xl md:text-3xl text-accent font-medium uppercase tracking-[0.2em] mb-12">
            Henrik Sissener
          </p>
          
          <div className="hero-text flex justify-center gap-6">
            {[ 
              { icon: <FaGithub />, href: "https://github.com/wisihe" },
              { icon: <FaLinkedin />, href: "https://linkedin.com/in/henrik-sissener" },
              { icon: <FaInstagram />, href: "https://instagram.com/wisihe" },
              { icon: <FaTwitter />, href: "https://twitter.com/wisihe" },
            ].map((social, i) => (
              <a 
                key={i}
                href={social.href} 
                target="_blank" 
                className="text-3xl text-foreground/50 hover:text-accent transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-accent/50 text-2xl">
          <FaChevronDown />
        </div>
      </section>

      {/* 2. THE JOURNEY SECTIONS */}
      {journeyData.map((item, idx) => (
        <section key={idx} className="journey-section min-h-screen py-32 px-4 md:px-8 flex items-center bg-surface/5 even:bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className={`journey-text space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <span className="text-accent font-bold tracking-[0.3em] uppercase block">{item.year}</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase text-foreground leading-tight italic">{item.title}</h2>
              <p className="text-xl md:text-2xl text-foreground/60 leading-relaxed font-light">
                {item.content}
              </p>
            </div>

            <div className={`journey-image relative ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
               <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-3xl opacity-50" />
               <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 3. SKILLS SECTION */}
      <section className="skills-entrance py-20 lg:py-40 bg-background border-t border-border/30">
        <SkillsSection />
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-40 px-4 text-center bg-surface/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-7xl font-black uppercase leading-tight">
            Lets create the <span className="text-accent italic">Future</span> together.
          </h2>
          <div className="flex justify-center">
            <a 
              href="/contact" 
              className="px-12 py-5 bg-foreground text-background font-black rounded-full text-xl uppercase tracking-widest shadow-2xl hover:bg-accent hover:text-white transition-all transform hover:scale-110"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
