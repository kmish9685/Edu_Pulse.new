import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 px-4 md:px-8 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          EduPulse
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/educator">
            <Button variant="glass" size="sm">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Learning Intelligence
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-6">
            Make invisible learning gaps <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              visible instantly.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8">
            The first live decision system for classrooms that helps silent, shy, and multilingual students without interrupting the lecture.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10">
            <Link href="/educator/new">
              <Button size="lg" className="rounded-full text-lg h-14 px-8">
                Start Live Session <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="rounded-full text-lg h-14 px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/Mockup Section */}
      <section id="features" className="px-4 md:px-8 pb-32">
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-900/20 relative">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Mock Dashboard UI */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white">Instant Signals</h3>
              <p className="text-gray-400">Students signal confusion anonymously with one tap. No login required.</p>
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white">Live Clarity Score</h3>
              <p className="text-gray-400">A single metric (0-100) showing if the class is following along.</p>
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white">Inclusive Learning</h3>
              <p className="text-gray-400">Empower shy and multilingual students to participate without fear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section id="how-it-works" className="py-24 px-4 md:px-8 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for the <span className="text-blue-400">Active Classroom</span></h2>
          <p className="text-xl text-gray-400">No LMS integration headaches. No student accounts. Just teaching.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { step: "01", title: "Start Session", desc: "Educator opens dashboard and projects the QR code." },
            { step: "02", title: "Students Join", desc: "Students scan instantly. No app download. No login." },
            { step: "03", title: "Teach Better", desc: "See confusion in real-time and adapt your pace." }
          ].map((item) => (
            <div key={item.step} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors mb-4">{item.step}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            © 2026 EduPulse. Built for EDVentures.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
