/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Star } from 'lucide-react';
import VimeoPlayer from '@vimeo/player';

interface Review {
  stars: number;
  text: string;
  name: string;
  company: string;
}

const REVIEWS: Review[] = [
  { stars: 5, text: "No matter what time you write, they get back to you within an hour. This is someone who truly knows their craft — you have zero chance of being unsatisfied with the result.", name: "James Whitfield", company: "Coldwell Banker Realty · New York, USA" },
  { stars: 5, text: "What a beautiful project. The final delivery was exactly as we envisioned. Professional, fast and incredibly detail-oriented.", name: "Elif Karaman", company: "Türkkep Digital · Istanbul, Turkey" },
  { stars: 5, text: "First time I've received a video with zero revision requests. Absolutely brilliant work. They understood the brief perfectly.", name: "Marco Rossi", company: "Luxury Estates Milano · Milan, Italy" },
  { stars: 5, text: "A remarkably talented team that knows exactly what they want and how to execute it. Looking forward to a long-term partnership.", name: "Sophie Beaumont", company: "Corpitall Group · Paris, France" },
  { stars: 5, text: "The storytelling approach they bring to real estate video is unlike anything I've seen. Our listings now get 3x more engagement.", name: "David Hartmann", company: "Premium Real Estate · Berlin, Germany" },
];

const PORTFOLIO_ITEMS = [
  {
    id: '0',
    type: 'vertical',
    muteSrc: 'https://player.vimeo.com/video/1189342201?autoplay=1&muted=1&loop=1&background=1',
    soundSrc: 'https://player.vimeo.com/video/1189342201?autoplay=1&muted=0&badge=0&autopause=0',
    category: 'Real Estate · Dynamic',
    name: 'Dynamic Retention Focus Editing For Social Media',
    tag: 'Dynamic Edit Real Estate · 2026',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=1280'
  },
  {
    id: '1',
    type: 'vertical',
    muteSrc: 'https://player.vimeo.com/video/1189342822?autoplay=1&muted=1&loop=1&background=1',
    soundSrc: 'https://player.vimeo.com/video/1189342822?autoplay=1&muted=0&badge=0&autopause=0',
    category: 'Luxury Villa · Cinematic',
    name: 'Soft Elegant Storytelling Project For Social Media',
    tag: 'Static Elegant Villa · Italy',
    coverImage: 'https://images.unsplash.com/photo-1600607687940-c52fb0478cc2?auto=format&fit=crop&q=80&w=1280'
  },
  {
    id: '2',
    type: 'horizontal',
    muteSrc: 'https://player.vimeo.com/video/1167211095?autoplay=1&muted=1&loop=1&background=1',
    soundSrc: 'https://player.vimeo.com/video/1167211095?autoplay=1&muted=0&badge=0&autopause=0',
    category: 'Commercial · Brand',
    name: 'Listing Project for Brand Coldwell Banker',
    tag: 'Coldwell Banker Commercial · Brand Film',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1280'
  }
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ src: string, isVertical: boolean } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ringPos = useRef({ x: 0, y: 0 });
  const modalIframeRef = useRef<HTMLIFrameElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [flashEmail, setFlashEmail] = useState(false);

  // Programmatic Volume Control for Modal
  useEffect(() => {
    let player: VimeoPlayer | null = null;
    
    if (isModalOpen && activeVideo && modalIframeRef.current) {
      player = new VimeoPlayer(modalIframeRef.current);
      
      const setupPlayer = async () => {
        try {
          await player!.ready();
          await player!.setVolume(1);
          await player!.setMuted(false);
          await player!.play();
        } catch (err) {
          console.warn('Vimeo Player error:', err);
        }
      };
      
      setupPlayer();
    }

    return () => {
      if (player) {
        player.destroy().catch(() => {});
      }
    };
  }, [isModalOpen, activeVideo]);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setFlashEmail(true);
    setTimeout(() => setFlashEmail(false), 2000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animateRing = () => {
      ringPos.current.x += (mousePos.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.y - ringPos.current.y) * 0.15;
      const ring = document.getElementById('cur-ring');
      if (ring) {
        ring.style.left = `${ringPos.current.x}px`;
        ring.style.top = `${ringPos.current.y}px`;
      }
      animationFrameId = requestAnimationFrame(animateRing);
    };
    animateRing();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  const openVideo = (src: string, isVertical: boolean) => {
    setActiveVideo({ src, isVertical });
    setIsModalOpen(true);
  };

  const closeVideo = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveVideo(null), 400);
  };

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-black bg-black text-warm-white font-mono overflow-x-hidden luxury-grain pb-20 md:pb-0">
      {/* Background Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.045]">
        <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <BGPattern />
        </svg>
      </div>

      {/* Custom Cursor */}
      <div
        id="cur"
        className="fixed w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[transform,background] duration-300 hidden md:block"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`, backgroundColor: isHovering ? 'var(--color-gold-light)' : 'var(--color-gold)' }}
      />
      <div
        id="cur-ring"
        className="fixed w-8 h-8 border border-gold/35 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-300 hidden md:block"
        style={{ width: isHovering ? 52 : 32, height: isHovering ? 52 : 32, borderColor: isHovering ? 'rgba(201,169,110,0.6)' : 'rgba(201,169,110,0.35)' }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] px-6 md:px-14 py-6 flex justify-between items-center bg-gradient-to-b from-black/98 to-transparent backdrop-blur-[2px]">
        <a href="#" className="font-serif text-xl font-light tracking-[0.35em] uppercase text-warm-white">
          Rapid Motion <span className="text-gold">X</span>
        </a>
        <ul className="hidden md:flex gap-10 list-none">
          {['Work', 'Services', 'Clients', 'Pricing', 'Contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-[10px] tracking-[0.28em] uppercase text-warm-white/50 hover:text-gold transition-colors"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end px-6 md:px-14 pb-24 overflow-hidden z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_20%,rgba(30,45,122,0.6)_0%,transparent_60%),radial-gradient(ellipse_40%_40%_at_20%_85%,rgba(201,169,110,0.07)_0%,transparent_50%)]" />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,45,122,0.6)_0%,transparent_70%)] top-[-150px] right-[-120px] pointer-events-none"
          animate={{
            x: [0, -40, 25, 0],
            y: [0, 50, -25, 0],
            scale: [1, 1.06, 0.94, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-grid mask-fade" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-[10px] tracking-[0.4em] uppercase text-gold mb-7 flex items-center gap-4"
          >
            <div className="w-8 h-px bg-gold" />
            Storyteller For Luxury Real Estate · Est. 2018
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="font-serif text-[clamp(48px,8.5vw,124px)] font-light leading-[0.9] tracking-tight mb-12"
          >
            Listings That<br /><em className="italic text-gold not-italic">Sell Faster.</em>
          </motion.h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              className="text-[11px] leading-[1.9] text-warm-white/50 tracking-wide max-w-[300px]"
            >
              Senior video editing studio specializing in luxury real estate. Cinematic quality. 48-hour delivery. Results that close deals.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              href="#contact"
              className="px-8 py-3.5 border border-gold/40 text-gold uppercase text-[10px] tracking-[0.3em] hover:bg-gold hover:text-black transition-all cursor-pointer md:cursor-none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Book a Free Call
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        >
          <div className="w-px h-[50px] bg-gradient-to-b from-gold to-transparent animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] text-warm-white/50 uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section id="craft" className="px-6 md:px-14 py-32 relative z-[1] bg-gradient-to-b from-black via-[#16206066] to-black overflow-hidden scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold flex items-center gap-4 mb-14">
            <div className="w-8 h-px bg-gold" />
            The Craft
          </div>
          <h2 className="font-serif text-[clamp(40px,5vw,68px)] font-light leading-[1.1] mb-20">
            Every Frame,<br /><em className="italic text-gold not-italic">Intentional.</em>
          </h2>

          <div className="relative w-full border border-gold/15 bg-[#08090f] rounded-[4px] overflow-hidden p-6 md:px-4 md:py-8">
            <div className="flex border-b border-white/7 mb-4 pb-2">
              {['00:00:00', '00:00:08', '00:00:16', '00:00:24', '00:00:32', '00:00:40', '00:00:48', '00:00:56'].map((time) => (
                <div key={time} className="flex-1 text-[7px] text-white/20 tracking-tighter border-l border-white/7 pl-1 pt-1">{time}</div>
              ))}
            </div>

            <motion.div
              className="absolute inset-y-0 w-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(255,80,80,0.4)] z-10"
              animate={{ left: ['5%', '95%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-0.5 -left-[4px] text-[10px] text-red-500/90">▼</div>
            </motion.div>

            <div className="flex flex-col gap-1.5">
              {[
                { track: 'V7', clips: [{ name: 'Exterior Wide', w: '18%', l: '2%', c: 'bg-blue-600/90 border-l-2 border-blue-400' }, { name: 'Color Grade', w: '12%', l: '55%', c: 'bg-gold/35 border-l-2 border-gold' }] },
                { track: 'V6', clips: [{ name: 'Living Room — Cinematic Walk', w: '28%', l: '22%', c: 'bg-gold/35 border-l-2 border-gold' }] },
                { track: 'V5', clips: [{ name: 'Master Bedroom', w: '22%', l: '5%', c: 'bg-white/14 border-l-2 border-white/35' }, { name: 'Pool — Aerial', w: '30%', l: '62%', c: 'bg-white/14 border-l-2 border-white/35' }] },
                { track: 'V4', clips: [{ name: 'Title Card', w: '10%', l: '1%', c: 'bg-blue-800/90 border-l-2 border-blue-500' }] },
                { track: 'V3', clips: [{ name: 'Motion Graphics', w: '20%', l: '12%', c: 'bg-emerald-900/75 border-l-2 border-emerald-400' }] }
              ].map((t) => (
                <div key={t.track} className="flex items-center gap-2 h-6">
                  <div className="w-7 text-[7px] text-white/30 shrink-0">{t.track}</div>
                  <div className="flex-1 h-full relative bg-white/2 rounded-[2px] overflow-hidden">
                    {t.clips.map((clip, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: clip.w }}
                        className={`absolute inset-y-0.5 rounded-[2px] px-1.5 flex items-center text-[6px] text-white/55 overflow-hidden whitespace-nowrap ${clip.c}`}
                        style={{ left: clip.l }}
                      >
                        {clip.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 h-9 mt-1">
                <div className="w-7 text-[7px] text-white/30 shrink-0">A1</div>
                <div className="flex-1 h-full flex items-center gap-[1px] p-1 bg-white/2 rounded-[2px] overflow-hidden">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="flex-1 rounded-[1px]"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        backgroundColor: i % 3 === 0 ? 'rgba(201,169,110,0.6)' : i % 3 === 1 ? 'rgba(22,32,96,0.95)' : 'rgba(245,243,239,0.18)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { val: '9', label: 'Years of Experience' },
              { val: '48h', label: 'Guaranteed Delivery' },
              { val: '200+', label: 'Projects Delivered' }
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-[48px] font-light text-gold leading-none">{s.val}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-warm-white/50 mt-2">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="px-6 md:px-14 py-32 bg-black relative z-[1] w-full max-w-7xl mx-auto scroll-mt-32">
        <div className="mb-5">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold flex items-center gap-4">
            <div className="w-8 h-px bg-gold" />
            Selected Work
          </div>
        </div>
        <h2 className="font-serif text-[clamp(36px,5vw,68px)] font-light leading-tight mb-20">
          Our <em className="italic text-gold not-italic">Portfolio</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mb-0.5">
          {PORTFOLIO_ITEMS.slice(0, 2).map((item) => (
            <PortfolioItem
              key={item.id}
              item={item}
              onOpen={() => openVideo(item.soundSrc, item.type === 'vertical')}
              isHoveringGlobal={isHovering}
              setIsHoveringGlobal={setIsHovering}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-0.5">
          <PortfolioItem
            item={PORTFOLIO_ITEMS[2]}
            onOpen={() => openVideo(PORTFOLIO_ITEMS[2].soundSrc, PORTFOLIO_ITEMS[2].type === 'vertical')}
            isHoveringGlobal={isHovering}
            setIsHoveringGlobal={setIsHovering}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 md:px-14 py-32 border-t border-gold/10 bg-gradient-to-b from-black via-[#1e2d7a33] to-black relative z-[1] scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold flex items-center gap-4 mb-14">
            <div className="w-8 h-px bg-gold" />
            What We Do
          </div>
          <h2 className="font-serif text-[clamp(24px,4vw,48px)] font-light mb-16">
            Our <em className="italic text-gold not-italic">Services</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
            {[
              { num: '01', title: 'Listing Videos', desc: 'Cinematic property walkthroughs that stop the scroll and move buyers to action. 60–90 second edits crafted for MLS and social platforms.' },
              { num: '02', title: 'Social Reels', desc: 'High-retention Reels and Shorts that build your personal brand and attract the right buyers through emotional, rhythm-driven narratives.' },
              { num: '03', title: 'Agent Branding', desc: 'Consistent content that positions you as the luxury agent. Delivered in 48 hours, every time.' }
            ].map((s) => (
              <div
                key={s.num}
                className="group relative p-12 bg-black/70 border border-gold/10 overflow-hidden transition-all duration-400 hover:bg-[#1e2d7a66] hover:border-gold/20"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="text-[10px] tracking-widest text-gold opacity-60 mb-8">{s.num}</div>
                <div className="font-serif text-2xl font-light mb-4.5">{s.title}</div>
                <p className="text-[11px] leading-[1.9] text-warm-white/50 tracking-wide">{s.desc}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="clients" className="px-6 md:px-14 py-32 border-t border-gold/5 bg-black relative z-[1] overflow-hidden scroll-mt-32">
        <div className="max-w-7xl mx-auto mb-16">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-gold" />
            Client Reviews
          </div>
          <h2 className="font-serif text-[clamp(24px,4vw,48px)] font-light">
            What Our <em className="italic text-gold not-italic">Clients Say</em>
          </h2>
        </div>
        <div className="relative overflow-hidden mt-16 before:absolute before:inset-y-0 before:left-0 before:w-32 before:z-10 before:bg-gradient-to-r before:from-black before:to-transparent after:absolute after:inset-y-0 after:right-0 after:w-32 after:z-10 after:bg-gradient-to-l after:from-black after:to-transparent">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} className="w-[360px] flex-shrink-0 p-9 bg-[#16206040] border border-gold/12 rounded-[2px] relative italic">
                <div className="flex gap-1 text-gold mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-[11px] leading-[1.85] text-warm-white/50 tracking-wide mb-6">"{r.text}"</p>
                <div className="flex flex-col gap-1 not-italic">
                  <span className="text-[11px] text-warm-white tracking-widest">{r.name}</span>
                  <span className="text-[10px] text-gold tracking-widest uppercase">{r.company}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing & Contact */}
      <section id="pricing" className="px-6 md:px-14 py-32 border-t border-gold/5 bg-gradient-to-b from-black via-[#16206040] to-black relative z-[1] scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold flex items-center gap-4 mb-16">
            <div className="w-8 h-px bg-gold" />
            Work With Us
          </div>
          <h2 className="font-serif text-[clamp(24px,4vw,48px)] font-light mb-16">
            Our <em className="italic text-gold not-italic">Packages</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div className="flex flex-col gap-0.5">
              {[
                { tier: 'Starter', includes: '4 Listing Videos / month · 8 Instagram Reels · 48-hour delivery · 2 rounds of revisions · Color grading included' },
                { tier: 'Growth', includes: '8 Listing Videos / month · 16 Instagram Reels · Priority 48-hour delivery · Unlimited revisions · Motion graphics included', featured: true },
                { tier: 'Elite', includes: 'Unlimited Videos · Unlimited Reels · 24-hour rush delivery · Dedicated account manager · Custom music licensing' }
              ].map((p, i) => (
                <div key={i} className={`p-9 relative transition-all duration-300 border border-gold/8 ${p.featured ? 'bg-[#1e2d7a80] border-gold/25' : 'bg-black/60 border-gold/8'}`}>
                  {p.featured && <div className="absolute top-0 right-0 bg-gold text-black text-[9px] tracking-widest px-3 py-1 font-medium">MOST POPULAR</div>}
                  <div className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3">{p.tier}</div>
                  <p className="text-[11px] leading-[1.7] text-warm-white/50">{p.includes}</p>
                  <button 
                    onClick={handlePricingClick}
                    className="text-[10px] text-gold/50 mt-4 tracking-tighter hover:text-gold transition-colors text-left cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    → Contact us for pricing
                  </button>
                </div>
              ))}
            </div>
            <div id="contact" className="flex flex-col scroll-mt-32">
              <div className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 text-center md:text-left">Ready to Close More Deals?</div>
              <h2 className="font-serif text-[clamp(40px,4vw,64px)] font-light leading-[0.95] mb-8 text-center md:text-left">
                Let's Work<br /><em className="italic text-gold not-italic">Together.</em>
              </h2>
              <p className="text-[11px] leading-[1.9] text-warm-white/50 mb-10 tracking-wide text-center md:text-left">
                Get in touch to receive a custom quote tailored to your needs. We respond within 1 hour.
              </p>
              <motion.a 
                href="mailto:rapidmotioninfo@gmail.com" 
                className={`block text-[14px] tracking-[0.2em] text-warm-white mb-8 hover:text-gold transition-colors text-center md:text-left underline decoration-gold/50`}
                animate={flashEmail ? { scale: [1, 1.05, 1], color: ['#f5f3ef', '#c9a96e', '#f5f3ef'] } : {}}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                rapidmotioninfo@gmail.com
              </motion.a>
              <div className="flex justify-center md:justify-start">
                <a
                  href="mailto:rapidmotioninfo@gmail.com"
                  className="px-12 py-4 border border-gold/40 text-gold uppercase text-[10px] tracking-[0.3em] hover:bg-gold hover:text-black transition-all cursor-pointer md:cursor-none"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Book a Free Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-14 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 relative z-[1]">
        <div className="font-serif text-base tracking-[0.3em] text-warm-white/50 uppercase">RAPID MOTION X</div>
        <div className="text-[10px] tracking-widest text-white/25 uppercase text-center md:text-left">© 2018 Rapid Motion X. All rights reserved.</div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-xl flex items-center justify-center p-0 md:p-6"
            onClick={closeVideo}
          >
            {/* Prominent Close Button */}
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[2001] w-14 h-14 flex flex-col items-center justify-center rounded-full bg-black/60 border border-white/20 hover:bg-gold hover:text-black transition-all group pointer-events-auto cursor-pointer shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                closeVideo();
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <X size={28} className="text-white group-hover:text-black mb-0.5" />
              <span className="text-[7px] font-bold uppercase tracking-widest text-white/70 group-hover:text-black/70">Close</span>
            </button>

            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className={`relative w-full h-full flex items-center justify-center ${activeVideo.isVertical ? 'max-w-[100vh]' : 'max-w-[min(95vw,1200px)]'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-full shadow-2xl border border-white/5 bg-black ${activeVideo.isVertical ? 'aspect-[9/16] h-[95vh] w-auto' : 'aspect-video w-full'}`}>
                <iframe
                  key={activeVideo.src}
                  ref={modalIframeRef}
                  src={activeVideo.src}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PortfolioItem({ item, onOpen, isHoveringGlobal, setIsHoveringGlobal, hoveredItem, setHoveredItem }: any) {
  const isHovered = hoveredItem === item.id;

  return (
    <div
      className={`relative group overflow-hidden bg-[#0a0a0a] cursor-pointer md:cursor-none ${item.type === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}
      onMouseEnter={() => {
        setIsHoveringGlobal(true);
        setHoveredItem(item.id);
      }}
      onMouseLeave={() => {
        setIsHoveringGlobal(false);
        setHoveredItem(null);
      }}
      onClick={onOpen}
    >
      {/* 1. Base Layer: Deep Background */}
      <div className="absolute inset-0 z-0 bg-neutral-950" />

      {/* 2. Video Preview (Now Always Playing) */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <iframe
          src={item.muteSrc}
          className="absolute inset-0 w-full h-full border-none scale-[1.05]"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* 3. Cover Image / Texture Overlay */}
      <div className="absolute inset-0 z-2 overflow-hidden">
        {item.coverImage && (
          <img 
            src={item.coverImage} 
            alt={item.name} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${isHovered ? 'opacity-0 scale-110 grayscale-[0.5]' : 'opacity-30 scale-100 grayscale-0'}`}
          />
        )}
        {/* Subtle Overlay to make text pop */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
      </div>

      {/* 4. Global Overlay for Readability */}
      <div className="absolute inset-0 z-[10] bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none opacity-80" />


      {/* 5. Center State UI (Play button for non-hovered) */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col justify-center items-center gap-6 z-[20] pointer-events-none"
          >
            <div className="w-16 h-16 border border-gold/40 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-xl group-hover:border-gold transition-colors duration-500">
              <Play size={24} fill="#c9a96e" className="text-gold translate-x-0.5" />
            </div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-gold font-medium bg-black/60 px-4 py-1.5 rounded-full border border-gold/10 backdrop-blur-sm">
              {item.tag}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Active Hover UI (Center Play button expands) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-gold rounded-full flex items-center justify-center z-[30] transition-all duration-700 bg-gold/5 backdrop-blur-[2px] ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="w-16 h-16 bg-gold flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(201,169,110,0.4)]">
          <Play size={24} fill="black" className="text-black translate-x-0.5" />
        </div>
      </div>

      {/* 7. Bottom Projects Info (Always visible, subtly moved on hover) */}
      <div className={`absolute bottom-0 inset-x-0 p-8 md:p-10 z-[40] transition-all duration-700 ${isHovered ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3 font-semibold flex items-center gap-3">
           <div className="w-5 h-px bg-gold/50" />
           {item.category}
        </div>
        <div className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight leading-tight">{item.name}</div>
      </div>
    </div>
  );
}

function BGPattern() {
  return (
    <g stroke="#c9a96e" strokeWidth="0.8" fill="none">
      <polygon points="120,200 180,140 240,200" opacity="0.6" />
      <rect x="140" y="200" width="40" height="35" opacity="0.6" />
      <rect x="155" y="210" width="10" height="15" opacity="0.4" />

      <polygon points="1200,350 1270,280 1340,350" opacity="0.5" />
      <rect x="1220" y="350" width="50" height="40" opacity="0.5" />
      <rect x="1238" y="362" width="14" height="18" opacity="0.3" />

      <polygon points="680,80 740,20 800,80" opacity="0.4" />
      <rect x="698" y="80" width="42" height="32" opacity="0.4" />

      <polygon points="50,600 100,550 150,600" opacity="0.35" />
      <rect x="65" y="600" width="30" height="24" opacity="0.35" />

      <polygon points="1380,650 1420,610 1460,650" opacity="0.4" />
      <rect x="1393" y="650" width="28" height="22" opacity="0.4" />

      <g stroke="#c9a96e" strokeWidth="0.6" opacity="0.35">
        <line x1="0" y1="480" x2="400" y2="480" />
        <line x1="0" y1="496" x2="300" y2="496" />
        <line x1="0" y1="512" x2="350" y2="512" />
        <rect x="20" y="473" width="80" height="7" rx="1" fill="rgba(201,169,110,0.15)" />
        <rect x="115" y="473" width="120" height="7" rx="1" fill="rgba(30,45,122,0.4)" />
        <rect x="250" y="473" width="60" height="7" rx="1" fill="rgba(201,169,110,0.1)" />
        <rect x="20" y="489" width="50" height="7" rx="1" fill="rgba(30,45,122,0.3)" />
        <rect x="85" y="489" width="100" height="7" rx="1" fill="rgba(201,169,110,0.12)" />
        <line x1="1040" y1="280" x2="1440" y2="280" />
        <rect x="1060" y="273" width="100" height="7" rx="1" fill="rgba(201,169,110,0.12)" />
      </g>

      <g stroke="#c9a96e" strokeWidth="0.4" opacity="0.15">
        <line x1="500" y1="0" x2="600" y2="900" />
        <line x1="900" y1="0" x2="800" y2="900" />
      </g>

      <g stroke="#c9a96e" strokeWidth="0.8" opacity="0.2">
        <path d="M30,30 L30,10 L50,10" />
        <path d="M1410,30 L1410,10 L1390,10" />
        <path d="M30,870 L30,890 L50,890" />
        <path d="M1410,870 L1410,890 L1390,890" />
      </g>
    </g>
  );
}
