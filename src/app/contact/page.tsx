"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import ContactIcon3D from "@/components/contact-icon-3d";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaGlobe,
  FaCheck,
  FaRocket,
  FaChevronRight,
  FaInfoCircle
} from "react-icons/fa";

// Zod Schema with optional Company and hidden Honeypot
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  company_verification: z.string().optional() // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

// Pre-generated static stars to prevent react-hooks/purity errors during render
const staticStars = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 3,
}));

// Twinkling space background with atmospheric nebulae and Earth crescent glow
function StarField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const stars = mounted ? staticStars : [];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#090022] to-[#04000f]" />

      {/* Atmospheric glowing nebulae */}
      <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[130px] animate-float-orb" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-blue-950/15 blur-[120px] animate-float-orb" style={{ animationDelay: "-8s" }} />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-indigo-900/10 blur-[90px] animate-float-orb" style={{ animationDelay: "-16s" }} />

      {/* Earth Silhouette background (subtle crescent glow in corner) */}
      <div className="absolute -bottom-[15%] -left-[10%] w-[600px] h-[600px] rounded-full border border-blue-500/5 bg-[#010006] shadow-[0_0_120px_rgba(59,130,246,0.06)]" />
      <div className="absolute -bottom-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent blur-md" />

      {/* Twinkling Star particles */}
      {mounted && stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Clean loading spinner SVG
function Loader() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setIsClient(true);
    document.title = "Contact & Collaborate | Mahammad Aftab";
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else if (response.status === 429) {
        setSubmitError("Rate limit exceeded. Please wait a while before sending another message.");
      } else if (result.error) {
        setSubmitError(result.error);
      } else {
        setSubmitError("Failed to send message. Please check your parameters and try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("A connection error occurred. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availabilityList = [
    { label: "Available for Opportunities", desc: "Open to full-time roles" },
    { label: "Open to Collaboration", desc: "GenAI & system architectures" },
    { label: "Freelance Availability", desc: "Consultations & MVP builds" },
    { label: "AI & Software Consulting", desc: "LLMs, RAG & Cloud scaling" }
  ];

  const contactCards = [
    { name: "Email", value: "mdaftabeditz360@gmail.com", href: "mailto:mdaftabeditz360@gmail.com", icon: <FaEnvelope className="text-purple-400" /> },
    { name: "LinkedIn", value: "mahammad-aftab", href: "https://www.linkedin.com/in/mahammad-aftab", target: "_blank", icon: <FaLinkedin className="text-blue-400" /> },
    { name: "GitHub", value: "mahammadaftab", href: "https://github.com/mahammadaftab", target: "_blank", icon: <FaGithub className="text-gray-300" /> },
    { name: "Portfolio", value: "mahammadaftab.me", href: "/", icon: <FaGlobe className="text-emerald-400" /> }
  ];

  const ctaServices = [
    "AI Projects",
    "Generative AI Solutions",
    "Software Engineering",
    "Full-Stack Development",
    "Cloud Architecture",
    "Research & Innovation"
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-[#030014]">
        <div className="text-white/40 text-sm font-semibold tracking-wider animate-pulse uppercase">
          Initializing Space Coordinates...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white overflow-hidden py-16 px-4 md:px-8">
      {/* Immersive Space Background */}
      <StarField />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Hero Header Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#a855f7]" />
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">Mission Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            Let&#39;s Build the Future Together
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Interested in AI, Generative AI, Software Engineering, Full-Stack Development, Cloud Solutions, or innovative technology projects? Let&#39;s connect and create something impactful.
          </p>
        </motion.div>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Glassmorphic Contact Form (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
            className="lg:col-span-7"
          >
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-purple-500/20 transition-colors duration-500">
              {/* Backlit Corner Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Transmission Link
              </h2>

              <AnimatePresence mode="wait">
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <FaCheck className="text-emerald-400 shrink-0 text-sm" />
                    Transmission successful! Your message has been sent to Mahammad Aftab.
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <FaInfoCircle className="text-red-400 shrink-0 text-sm" />
                    {submitError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Honeypot Spam Prevention field - fully hidden */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company_verification")}
                    placeholder="Verification tag, please leave empty."
                  />
                </div>

                {/* Grid row for Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name input */}
                  <div className="relative group">
                    <input
                      suppressHydrationWarning={true}
                      type="text"
                      id="name"
                      placeholder=" "
                      {...register("name")}
                      className={`peer w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-1 transition-all duration-300 text-sm ${
                        errors.name 
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50" 
                          : "border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50"
                      }`}
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-3 text-xs text-gray-500 transition-all duration-300 pointer-events-none
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
                                 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-[#07011d] peer-focus:px-1.5
                                 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-purple-400 peer-[:not(:placeholder-shown)]:bg-[#07011d] peer-[:not(:placeholder-shown)]:px-1.5"
                    >
                      Full Name
                    </label>
                    {errors.name && (
                      <p className="mt-1.5 text-[11px] text-red-400 font-medium pl-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email input */}
                  <div className="relative group">
                    <input
                      suppressHydrationWarning={true}
                      type="email"
                      id="email"
                      placeholder=" "
                      {...register("email")}
                      className={`peer w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-1 transition-all duration-300 text-sm ${
                        errors.email 
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50" 
                          : "border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50"
                      }`}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3 text-xs text-gray-500 transition-all duration-300 pointer-events-none
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
                                 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-[#07011d] peer-focus:px-1.5
                                 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-purple-400 peer-[:not(:placeholder-shown)]:bg-[#07011d] peer-[:not(:placeholder-shown)]:px-1.5"
                    >
                      Email Address
                    </label>
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-red-400 font-medium pl-1">{errors.email.message}</p>
                    )}
                  </div>

                </div>

                {/* Grid row for Company & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Company Input (Optional) */}
                  <div className="relative group">
                    <input
                      suppressHydrationWarning={true}
                      type="text"
                      id="company"
                      placeholder=" "
                      {...register("company")}
                      className="peer w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-sm"
                    />
                    <label
                      htmlFor="company"
                      className="absolute left-4 top-3 text-xs text-gray-500 transition-all duration-300 pointer-events-none
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
                                 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-[#07011d] peer-focus:px-1.5
                                 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-purple-400 peer-[:not(:placeholder-shown)]:bg-[#07011d] peer-[:not(:placeholder-shown)]:px-1.5"
                    >
                      Company / Organization (Optional)
                    </label>
                  </div>

                  {/* Subject Input */}
                  <div className="relative group">
                    <input
                      suppressHydrationWarning={true}
                      type="text"
                      id="subject"
                      placeholder=" "
                      {...register("subject")}
                      className={`peer w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-1 transition-all duration-300 text-sm ${
                        errors.subject 
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50" 
                          : "border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50"
                      }`}
                    />
                    <label
                      htmlFor="subject"
                      className="absolute left-4 top-3 text-xs text-gray-500 transition-all duration-300 pointer-events-none
                                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
                                 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-[#07011d] peer-focus:px-1.5
                                 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-purple-400 peer-[:not(:placeholder-shown)]:bg-[#07011d] peer-[:not(:placeholder-shown)]:px-1.5"
                    >
                      Subject
                    </label>
                    {errors.subject && (
                      <p className="mt-1.5 text-[11px] text-red-400 font-medium pl-1">{errors.subject.message}</p>
                    )}
                  </div>

                </div>

                {/* Message input */}
                <div className="relative group">
                  <textarea
                    suppressHydrationWarning={true}
                    id="message"
                    rows={6}
                    placeholder=" "
                    {...register("message")}
                    className={`peer w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-1 transition-all duration-300 text-sm resize-none ${
                      errors.message 
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50" 
                        : "border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50"
                    }`}
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-3 text-xs text-gray-500 transition-all duration-300 pointer-events-none
                               peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
                               peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-[#07011d] peer-focus:px-1.5
                               peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-purple-400 peer-[:not(:placeholder-shown)]:bg-[#07011d] peer-[:not(:placeholder-shown)]:px-1.5"
                  >
                    Your Message
                  </label>
                  {errors.message && (
                    <p className="mt-1.5 text-[11px] text-red-400 font-medium pl-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  suppressHydrationWarning={true}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 disabled:opacity-75 flex items-center justify-center active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader /> Initiating Link...
                    </>
                  ) : (
                    "Establish Transmission"
                  )}
                </button>

              </form>
            </div>
          </motion.div>

          {/* Right Column: Availability, Contact Info & 3D Interactive Card (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Operational Status Card */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Operational Availability
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {availabilityList.map((status, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-purple-500/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-emerald-400 text-xs shrink-0" />
                      <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{status.label}</h4>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-snug pl-4">{status.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Glassmorphic Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {contactCards.map((card, idx) => (
                <a
                  key={idx}
                  href={card.href}
                  target={card.target || "_self"}
                  rel={card.target ? "noopener noreferrer" : ""}
                  className="backdrop-blur-md bg-white/[0.01] border border-white/5 hover:border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between hover:shadow-[0_4px_25px_rgba(0,0,0,0.35)] transition-all duration-300 group cursor-pointer min-w-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </span>
                    <FaChevronRight className="text-[10px] text-gray-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{card.name}</h4>
                    <p className="text-xs font-bold text-gray-200 group-hover:text-white truncate max-w-full select-all">{card.value}</p>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* Astronaut 3D Canvas Box */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="px-5 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                  <FaRocket className="text-[9px]" /> Orbit Vector Coordinates
                </span>
                <span className="text-[9px] font-semibold text-gray-500 uppercase">Interactive 3D Canvas</span>
              </div>
              <div className="relative w-full aspect-video max-h-[260px] bg-black/20 flex items-center justify-center">
                <ContactIcon3D size={260} />
              </div>
            </motion.div>

          </div>

        </div>

        {/* Closing CTA and Skills Banner */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 backdrop-blur-xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 border border-white/[0.06] rounded-3xl p-8 text-center relative overflow-hidden group"
        >
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-lg font-black tracking-tight text-white mb-2 uppercase">
            Start the Engineering Pipeline
          </h3>
          <p className="text-xs text-gray-400 max-w-xl mx-auto mb-6">
            Let&#39;s collaborate on advanced systems development, scalable architectures, or deep-learning model integration. Ready to consult on projects worldwide.
          </p>

          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
            {ctaServices.map((service, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:border-purple-500/20 transition-all duration-300"
              >
                {service}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}