'use client'

import { useEffect, useState, useRef, FormEvent, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Instagram,
  Mail,
  Menu,
  X,
  ShoppingBag,
  Palette,
  ChevronRight,
  Loader2,
  ArrowUp,
} from 'lucide-react'

import { Variants } from "framer-motion";

/* ──────────── Types ──────────── */
interface Artwork {
  id: string
  title: string
  description: string | null
  price: number
  medium: string
  dimensions: string
  imageUrl: string
  isAvailable: boolean
  sortOrder: number
}

/* ──────────── Animation helpers ──────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } as const,
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

function SectionHeading({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={`text-center mb-12 ${className}`}
    >
      <motion.h2
        variants={fadeUp}
        custom={0}
        className="text-3xl md:text-4xl font-semibold tracking-tight"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

/* ──────────── Navigation ──────────── */
function Navbar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('hero')}
          className="text-lg font-semibold tracking-wide"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Marcus Carter
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
          <a
            href="https://instagram.com/eastvillagenyc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="size-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onNavigate(l.id)
                    setMobileOpen(false)
                  }}
                  className="text-left text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="https://instagram.com/eastvillagenyc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground py-1 flex items-center gap-2"
              >
                <Instagram className="size-4" /> @eastvillagenyc
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ──────────── Hero Section ──────────── */
function HeroSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.squarespace-cdn.com/content/v1/6598bd928a7fcc2ab5804a23/58494dcd-ad36-4a16-88d7-3e94292701cb/image_123650291+%282%29.JPG?format=2500w)`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-white/70 mb-4"
        >
          Abstract Artist
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Marcus Carter
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed mb-10"
        >
          Exploring life&apos;s essence through an abstract lens from New York City&apos;s East Village
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => onNavigate('gallery')}
            className="bg-white text-black hover:bg-white/90 text-base px-8"
          >
            <Palette className="size-4 mr-2" />
            View Gallery
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate('contact')}
            className="border-white/40 text-white hover:bg-white/10 text-base px-8"
          >
            Get in Touch
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ──────────── About Section ──────────── */
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="About the Artist"
          subtitle="Four decades of experience shaping abstract expression"
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          <motion.div variants={fadeUp} custom={0} className="space-y-5 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p>
              Based in New York City&apos;s East Village, Marcus Carter creates paintings that explore life&apos;s
              essence through an abstract lens, employing a vibrant palette, symbolic imagery, and elements drawn
              from four decades of experience with diagnostic imaging and various technologies.
            </p>
            <p>
              &ldquo;My work is driven by a deep sense of empathy toward humanity and an unwavering faith that
              kindness will triumph. This conviction is mirrored in my art, as I draw inspiration from the
              masterful works of Basquiat, Beckmann, Kandinsky, Klee, de Kooning and Mir&oacute; — artists whom
              I greatly admire.&rdquo;
            </p>
            <p>
              &ldquo;I spent most of my adult life working in diagnostic imaging and aspects of that life are
              evident in some of my art — transforming the hidden structures of the human body into abstract
              landscapes of color and form.&rdquo;
            </p>
            <p>
              &ldquo;It is my aspiration to impart to the younger generation that a bright future awaits them.
              Don&apos;t hasten the journey to adulthood; rather, relish your youthful years and channel your
              energy into enhancing the world around us.&rdquo;
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <blockquote className="border-l-4 border-black/10 pl-5 italic text-muted-foreground text-sm leading-relaxed">
              &ldquo;That&apos;s a profoundly moving approach to your artistry. It&apos;s clear that you channel deep
              empathy and reflection into your work, transforming the often harsh realities of human experience
              into something that can be seen, felt, and understood on a visceral level. By capturing the essence
              of those souls and their stories, you&apos;re not only creating art but also bearing witness to their
              experiences and sharing them with the world.&rdquo;
              <span className="block mt-2 text-xs font-medium text-foreground not-italic">— Collector</span>
            </blockquote>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: 'Location', value: 'East Village, NYC' },
                { label: 'Medium', value: 'Mixed Media' },
                { label: 'Experience', value: '40+ Years' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href="mailto:marcuscarternyc@protonmail.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                marcuscarternyc@protonmail.com
              </a>
            </div>
            <a
              href="https://instagram.com/eastvillagenyc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="size-4" />
              @eastvillagenyc
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────── Gallery Section ──────────── */
function ArtworkCard({
  artwork,
  index,
  onSelect,
}: {
  artwork: Artwork
  index: number
  onSelect: (a: Artwork) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index % 4}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="group cursor-pointer"
      onClick={() => onSelect(artwork)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted mb-3">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="size-4" />
              {artwork.isAvailable ? 'View Details' : 'Sold'}
            </span>
          </motion.div>
        </div>
        {!artwork.isAvailable && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-black/70 text-white border-0">
            Sold
          </Badge>
        )}
      </div>
      <h3
        className="font-semibold text-base mb-1 group-hover:underline underline-offset-4"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {artwork.title}
      </h3>
      <p className="text-xs text-muted-foreground">{artwork.medium} &middot; {artwork.dimensions}</p>
      {artwork.isAvailable && (
        <p className="text-sm font-medium mt-1">${artwork.price.toLocaleString()}</p>
      )}
    </motion.div>
  )
}

function PurchaseDialog({
  artwork,
  open,
  onOpenChange,
}: {
  artwork: Artwork | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!artwork) return

    if (!formData.name || !formData.email) {
      toast({ title: 'Please fill in your name and email', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, artworkId: artwork.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      toast({
        title: 'Inquiry Submitted!',
        description: data.message,
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
      onOpenChange(false)
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) setFormData({ name: '', email: '', phone: '', message: '' })
  }, [open])

  if (!artwork) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-playfair), serif' }}>
            Purchase Inquiry
          </DialogTitle>
          <DialogDescription>
            You&apos;re interested in <span className="font-medium text-foreground">{artwork.title}</span> —{' '}
            <span className="font-medium text-foreground">${artwork.price.toLocaleString()}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg overflow-hidden aspect-video bg-muted mb-2">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{artwork.medium}</span>
          <span>&middot;</span>
          <span>{artwork.dimensions}</span>
        </div>

        <Separator className="my-2" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="inquiry-name">Name *</Label>
            <Input
              id="inquiry-name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inquiry-email">Email *</Label>
            <Input
              id="inquiry-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inquiry-phone">Phone (optional)</Label>
            <Input
              id="inquiry-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inquiry-message">Message (optional)</Label>
            <Textarea
              id="inquiry-message"
              placeholder="Any questions about this piece, shipping, or commissioning similar work..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Submit Inquiry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function GallerySection() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetch('/api/artworks')
      .then((r) => r.json())
      .then((data) => {
        setArtworks(data.artworks)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="gallery" className="py-20 md:py-28 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="Gallery"
          subtitle="Each piece is a window into the unseen — where diagnostic precision meets raw emotional expression"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] rounded-lg mb-3" />
                <Skeleton className="h-4 w-2/3 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks?.map((artwork, i) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                index={i}
                onSelect={(a) => {
                  if (a.isAvailable) {
                    setSelectedArtwork(a)
                    setDialogOpen(true)
                  }
                }}
              />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-10">
          Prices are in USD. Shipping and framing available upon request. All purchases include a certificate of authenticity.
        </p>
      </div>

      <PurchaseDialog
        artwork={selectedArtwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}

/* ──────────── Contact Section ──────────── */
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      toast({
        title: 'Message Sent!',
        description: data.message,
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="Get in Touch"
          subtitle="Interested in a piece, want to commission work, or just want to say hello?"
        />

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="max-w-xl mx-auto"
        >
          <motion.form variants={fadeUp} custom={0} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name *</Label>
                <Input
                  id="contact-name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Phone (optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                placeholder="Tell Marcus what's on your mind — inquiries about work, commissions, exhibitions, or anything else..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Send Message
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </motion.form>

          <motion.div variants={fadeUp} custom={1} className="mt-8 text-center space-y-3">
            <Separator />
            <div className="flex items-center justify-center gap-6 pt-4">
              <a
                href="mailto:marcuscarternyc@protonmail.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                marcuscarternyc@protonmail.com
              </a>
              <a
                href="https://instagram.com/eastvillagenyc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="size-4" />
                @eastvillagenyc
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────── Footer ──────────── */
function Footer() {
  return (
    <footer className="bg-zinc-950 text-white/70 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Marcus Carter
            </h3>
            <p className="text-xs mt-1">Abstract Artist &middot; East Village, NYC</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:marcuscarternyc@protonmail.com"
              className="text-sm hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </a>
            <a
              href="https://instagram.com/eastvillagenyc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>
        <Separator className="my-6 bg-white/10" />
        <p className="text-xs text-center">
          &copy; {new Date().getFullYear()} Marcus Carter. All rights reserved. All artwork images are copyrighted.
        </p>
      </div>
    </footer>
  )
}

/* ──────────── Back to Top ──────────── */
function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ──────────── Main Page ──────────── */
export default function Home() {
  const navigateTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onNavigate={navigateTo} />
      <main className="flex-1">
        <HeroSection onNavigate={navigateTo} />
        <AboutSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}