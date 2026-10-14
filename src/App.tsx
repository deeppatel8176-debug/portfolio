import React, { useState, useEffect } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  CheckCircle,
  Code2,
  Palette,
  Terminal,
  MapPin,
  GraduationCap,
  Loader2,
  Download,
} from "lucide-react"
import { IdCard } from "@/components/ui/id-card"
import { ProjectShowcase } from "@/components/ui/project-showcase"
import { ContributionSkyline } from "@/components/ui/contribution-skyline"

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  )
}

export default function App() {
  const [view, setView] = useState<"card" | "details">("card")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [githubData, setGithubData] = useState<{ date: string; count: number }[] | undefined>(undefined)
  const [githubTotal, setGithubTotal] = useState<number>(161)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const REAL_EMAIL = "pateldeep1783@gmail.com"
  const REAL_GITHUB = "https://github.com/deeppatel8176-debug"
  const REAL_LINKEDIN = "https://www.linkedin.com/in/deep-patel-64a166369"
  const RESUME_URL = "/Deep_Patel_Resume.pdf"

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view])

  // Fetch real GitHub contribution data
  useEffect(() => {
    setGithubLoading(true)
    fetch("https://github-contributions-api.jogruber.de/v4/deeppatel8176-debug?y=last")
      .then((r) => r.json())
      .then((json) => {
        if (json?.contributions) {
          setGithubData(json.contributions)
          const total = json.total?.lastYear ?? json.total?.[Object.keys(json.total)[0]] ?? 161
          setGithubTotal(total)
        }
      })
      .catch(() => { /* falls back to generated data */ })
      .finally(() => setGithubLoading(false))
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(REAL_EMAIL)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${REAL_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio Message from ${formData.name}`,
          _template: "table",
        }),
      })

      if (response.ok) {
        setContactSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setContactSubmitted(false), 6000)
      } else {
        throw new Error("API submit failed")
      }
    } catch {
      // Direct mailto fallback so user inquiry is never lost
      const mailtoUrl = `mailto:${REAL_EMAIL}?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`
      window.location.href = mailtoUrl
      setContactSubmitted(true)
      setTimeout(() => setContactSubmitted(false), 6000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // View 1: The ID Card Badge (matching Image 1)
  if (view === "card") {
    return (
      <IdCard
        onOpenDetails={() => setView("details")}
        name="Deep Patel"
        role="Software Developer at Coding House"
        modelId="DEEPPATEL8176-DEBUG"
        experience="Sarvajanik University // MCA"
        status="Active / Available"
      />
    )
  }

  // View 2: Minimalist, editorial details page (matching Image 2 aesthetics)
  return (
    <div className="min-h-screen bg-[#070709] text-gray-200 selection:bg-white selection:text-black font-sans antialiased">
      {/* Top Floating Minimalist Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070709]/80 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setView("card")}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>ID Badge Card</span>
          </button>

          <nav className="flex items-center gap-6 text-xs font-mono text-gray-400">
            <a href="#about" className="hover:text-white transition-colors hidden sm:inline-block">
              About
            </a>
            <a href="#skills" className="hover:text-white transition-colors hidden sm:inline-block">
              Skills
            </a>
            <a href="#projects" className="text-white hover:text-gray-300 transition-colors">
              Projects
            </a>
            <a href="#github-activity" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#experience" className="hover:text-white transition-colors hidden sm:inline-block">
              Experience
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <a
              href={RESUME_URL}
              download="Deep_Patel_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Resume</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-24">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AVAILABLE FOR HIRE & COLLABORATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-[1.1]">
            Deep Patel
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 font-light leading-relaxed">
            Backend & Full Stack Developer specializing in <span className="text-white font-normal">PHP, Laravel, NestJS & REST APIs</span>.
            Building high-performance server architectures, robust database schemas, and modern web applications from Surat, India.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Surat, Gujarat, India
            </span>
            <span className="text-gray-600">•</span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Sarvajanik University (MCA 2024–2026)
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
            >
              {copiedEmail ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? "EMAIL COPIED!" : REAL_EMAIL}</span>
            </button>
            <a
              href={REAL_GITHUB}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.08] transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </a>
            <a
              href={REAL_LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.08] transition-all"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LINKEDIN</span>
            </a>
            <a
              href={RESUME_URL}
              download="Deep_Patel_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/25 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD RESUME</span>
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="space-y-6 pt-12 border-t border-gray-800/80">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase">
            ABOUT
          </h2>
          <div className="space-y-4 text-gray-300 text-base sm:text-lg font-light leading-relaxed">
            <p>
              I am a Backend and Full Stack Developer with an MCA from <strong className="text-white font-medium">Sarvajanik University</strong> and a BCA from <strong className="text-white font-medium">Vivekanand College (VNSGU)</strong>.
            </p>
            <p className="text-gray-400">
              My core strengths lie in designing clean, scalable backend systems with <span className="text-white">PHP, Laravel, NestJS, and RESTful APIs</span>, alongside database architecture in <span className="text-white">MySQL and Microsoft SQL Server</span>. I also develop responsive, dynamic web applications with React, Next.js, and modern CSS tooling. Key projects include WallVibe (wallpaper platform), AI Property Manager, Website Tools, and Jarvis AI Assistant.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="space-y-6 pt-12 border-t border-gray-800/80">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase">
            SKILLS & DISCIPLINES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Backend & APIs</span>
              </div>
              <ul className="text-xs font-mono text-gray-400 space-y-1.5">
                <li>PHP & Laravel</li>
                <li>NestJS & Node.js</li>
                <li>C# & ASP.NET</li>
                <li>RESTful API Design</li>
                <li>MVC Architecture</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Databases & Tools</span>
              </div>
              <ul className="text-xs font-mono text-gray-400 space-y-1.5">
                <li>MySQL & SQL Server</li>
                <li>MongoDB</li>
                <li>Postman & API Testing</li>
                <li>Git & GitHub Workflows</li>
                <li>Cloudinary & Vercel</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Frontend & UI</span>
              </div>
              <ul className="text-xs font-mono text-gray-400 space-y-1.5">
                <li>JavaScript & TypeScript</li>
                <li>React & Next.js</li>
                <li>Tailwind CSS & shadcn/ui</li>
                <li>HTML5 & CSS3</li>
                <li>Responsive UI Design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="pt-12 border-t border-gray-800/80">
          <ProjectShowcase />
        </section>

        {/* GitHub Activity Skyline Section */}
        <section id="github-activity" className="space-y-6 pt-12 border-t border-gray-800/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                GITHUB ACTIVITY // DEEPPATEL8176-DEBUG
              </h2>
              <p className="text-xl sm:text-2xl font-light text-white mt-1 flex items-center gap-2">
                Contribution Skyline
                {githubLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <span className="text-emerald-400">({githubTotal}+ Contributions)</span>
                )}
              </p>
            </div>
            <a
              href={REAL_GITHUB}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GITHUB PROFILE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-sm text-gray-400 font-light">
            {githubLoading
              ? "Loading real-time GitHub activity…"
              : "Interactive contribution heatmap folding into a 3D skyline. Featuring 51 recent commits across 2 primary repositories: "}
            {!githubLoading && <><span className="text-white">ai-property-manager</span> and <span className="text-white">wallpaper_app</span>.</>}
          </p>

          <div className="pt-2">
            <ContributionSkyline palette="github" defaultView="3d" data={githubData} />
          </div>
        </section>

        {/* Experience & Education Section */}
        <section id="experience" className="space-y-6 pt-12 border-t border-gray-800/80">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase">
            EXPERIENCE & EDUCATION
          </h2>

          <div className="divide-y divide-gray-800/80">
            {[
              {
                role: "Master of Computer Applications (MCA)",
                company: "Sarvajanik University",
                location: "Surat, Gujarat, India",
                year: "2024 - 2026",
                description: "Advanced study in enterprise software development, distributed systems, database design, and modern backend architectures.",
              },
              {
                role: "Software & Web Developer",
                company: "DigiTextile & CrickReward // Coding House",
                location: "Surat, Gujarat, India",
                year: "2024 - PRESENT",
                description: "Engineering scalable backend systems, RESTful APIs in PHP/Laravel & NestJS, Cloudinary media processing, and automated client workflows.",
              },
              {
                role: "Bachelor of Computer Applications (BCA)",
                company: "Vivekanand College for Advanced Computer & Info Science (VNSGU)",
                location: "Surat, Gujarat, India",
                year: "2021 - 2024",
                description: "Comprehensive foundation in computer science, object-oriented programming (C#, PHP, Java), SQL relational databases, and web technologies.",
              },
            ].map((exp, idx) => (
              <div key={idx} className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg text-white font-medium">{exp.role}</h3>
                  <div className="text-xs font-mono text-emerald-400 mt-0.5 flex items-center gap-2">
                    <span>{exp.company}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">{exp.location}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-light mt-2 max-w-xl">{exp.description}</p>
                </div>
                <span className="text-xs font-mono text-gray-500 tabular-nums shrink-0">{exp.year}</span>
              </div>
            ))}
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="space-y-6 pt-12 border-t border-gray-800/80">
          <h2 className="text-xs font-mono tracking-widest text-gray-400 uppercase">
            CONTACT & WORK INQUIRIES
          </h2>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <div>
              <h3 className="text-2xl font-light text-white">Let&apos;s build together</h3>
              <p className="text-sm text-gray-400 font-light mt-1">
                Reach out for full-stack development, software contracts, or open-source collaborations.
              </p>
            </div>

            {contactSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Message sent to {REAL_EMAIL}! Thanks for reaching out, I&apos;ll get back to you directly.</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 mb-1">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-gray-400 mb-1">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-msg" className="block text-xs font-mono text-gray-400 mb-1">
                  MESSAGE
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hi Deep, I'd like to talk about a project..."
                  className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-black hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SENDING EMAIL...</span>
                    </>
                  ) : (
                    <span>SEND INQUIRY →</span>
                  )}
                </button>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <a href={`mailto:${REAL_EMAIL}`} className="hover:text-white transition-colors">
                    {REAL_EMAIL}
                  </a>
                  <span className="text-gray-600">•</span>
                  <span>+91 98249 08176</span>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>© {new Date().getFullYear()} DEEP PATEL. SURAT, GUJARAT, INDIA.</div>
          <button
            onClick={() => setView("card")}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            RETURN TO ID BADGE ↑
          </button>
        </footer>
      </main>
    </div>
  )
}
