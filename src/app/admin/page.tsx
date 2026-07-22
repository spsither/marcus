'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, DollarSign, ShoppingBag, Mail, Lock, Loader2, Check, ChevronUp, ChevronDown, Palette, ExternalLink, Plus, X, Trash2, Image as ImageIcon } from 'lucide-react'

interface Artwork { id: string; title: string; description: string | null; price: number; medium: string; dimensions: string; imageUrl: string; isAvailable: boolean; sortOrder: number }
interface ContactSubmission { id: string; name: string; email: string; phone: string | null; message: string; createdAt: string }
interface PurchaseInquiry { id: string; name: string; email: string; phone: string | null; message: string | null; createdAt: string; artwork: { id: string; title: string; price: number } }

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const emptyForm = { title: '', description: '', price: '', medium: '', dimensions: '', imageUrl: '' }

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (res.ok) { sessionStorage.setItem('admin_auth', '1'); onAuth() } else setError('Incorrect password.')
    } catch { setError('Connection error.') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Card className="border-stone-800 bg-stone-900/80 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3"><Lock className="w-6 h-6 text-amber-400" /></div>
            <CardTitle className="text-xl text-stone-100 font-[family-name:var(--font-playfair)]">Admin Access</CardTitle>
            <p className="text-sm text-stone-400 mt-1">Marcus Carter Portfolio</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label className="text-stone-300 text-sm">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500" autoFocus /></div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" disabled={loading || !password} className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Sign In</Button>
            </form>
            <p className="text-xs text-stone-500 text-center mt-4">Default password: marcus2024</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function ArtworkRow({ artwork, onUpdate, onDelete }: { artwork: Artwork; onUpdate: (id: string, data: Partial<Artwork>) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: artwork.title,
    description: artwork.description ?? '',
    price: String(artwork.price),
    medium: artwork.medium,
    dimensions: artwork.dimensions,
    imageUrl: artwork.imageUrl,
  })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const price = parseFloat(form.price)

    if (isNaN(price) || price < 0) {
      toast({
        title: 'Invalid price',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        price,
        medium: form.medium.trim(),
        dimensions: form.dimensions.trim(),
        imageUrl: form.imageUrl.trim(),
      }

      const res = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onUpdate(artwork.id, payload)

        toast({
          title: 'Artwork updated',
        })

        setEditing(false)
      } else {
        toast({
          title: 'Update failed',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }
  const handleToggle = async () => { const v = !artwork.isAvailable; try { const res = await fetch(`/api/artworks/${artwork.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAvailable: v }) }); if (res.ok) { onUpdate(artwork.id, { isAvailable: v }); toast({ title: v ? 'Available' : 'Sold' }) } } catch { toast({ title: 'Error', variant: 'destructive' }) } }
  const handleMove = async (dir: 'up' | 'down') => { const n = artwork.sortOrder + (dir === 'up' ? -1 : 1); if (n < 1) return; try { const res = await fetch(`/api/artworks/${artwork.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: n }) }); if (res.ok) onUpdate(artwork.id, { sortOrder: n }) } catch { toast({ title: 'Error', variant: 'destructive' }) } }
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/artworks/${artwork.id}`, { method: 'DELETE' })
      if (res.ok) { onDelete(artwork.id); toast({ title: `"${artwork.title}" deleted` }); setConfirmDelete(false) }
      else toast({ title: 'Failed to delete', variant: 'destructive' })
    } catch { toast({ title: 'Error', variant: 'destructive' }) }
  }
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-stone-800 bg-stone-900/50 hover:bg-stone-800/50 transition-colors group">
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-stone-800"><img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" loading="lazy" />{!artwork.isAvailable && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Badge variant="destructive" className="text-[10px] px-1.5 py-0">SOLD</Badge></div>}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2"><h3 className="font-medium text-stone-100 truncate text-sm">{artwork.title}</h3><Badge variant="outline" className="text-[10px] border-stone-700 text-stone-400 flex-shrink-0">{artwork.medium}</Badge></div>
        <p className="text-xs text-stone-500 mt-0.5">{artwork.dimensions}</p>
        {editing ? (
          <div className="space-y-3 mt-3">

            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Title"
            />

            <Textarea
              value={form.description}
              onChange={(e) =>
                updateField('description', e.target.value)
              }
              placeholder="Description"
              rows={3}
            />

            <Input
              value={form.medium}
              onChange={(e) =>
                updateField('medium', e.target.value)
              }
              placeholder="Medium"
            />

            <Input
              value={form.dimensions}
              onChange={(e) =>
                updateField('dimensions', e.target.value)
              }
              placeholder="Dimensions"
            />

            <Input
              value={form.imageUrl}
              onChange={(e) =>
                updateField('imageUrl', e.target.value)
              }
              placeholder="Image URL"
            />

            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                updateField('price', e.target.value)
              }
              placeholder="Price"
            />

            <div className="flex gap-2">

              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setEditing(false)

                  setForm({
                    title: artwork.title,
                    description: artwork.description ?? '',
                    price: String(artwork.price),
                    medium: artwork.medium,
                    dimensions: artwork.dimensions,
                    imageUrl: artwork.imageUrl,
                  })
                }}
              >
                Cancel
              </Button>

            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-amber-400 font-semibold text-sm mt-1 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1">{fmt(artwork.price)}<span className="text-stone-500 text-[10px]">(click to edit)</span></button>)}
      </div>
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-0.5"><button onClick={() => handleMove('up')} className="p-1 rounded hover:bg-stone-700 text-stone-400 hover:text-stone-200 cursor-pointer"><ChevronUp className="w-3.5 h-3.5" /></button><button onClick={() => handleMove('down')} className="p-1 rounded hover:bg-stone-700 text-stone-400 hover:text-stone-200 cursor-pointer"><ChevronDown className="w-3.5 h-3.5" /></button></div>
        <div className="flex items-center gap-1.5"><span className="text-[10px] text-stone-500">{artwork.isAvailable ? 'For Sale' : 'Sold'}</span><Switch checked={artwork.isAvailable} onCheckedChange={handleToggle} className="scale-75" /></div>
      </div>
      <div className="flex-shrink-0 ml-1">
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-md text-stone-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" title="Delete artwork">
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={handleDelete} className="px-2 py-1 rounded text-[11px] font-medium bg-red-600 hover:bg-red-700 text-white cursor-pointer">Delete</button>
            <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 rounded text-[11px] font-medium text-stone-400 hover:text-stone-200 cursor-pointer">No</button>
          </div>
        )}
      </div>
    </div>
  )
}

function AddArtworkForm({ onAdded, onCancel }: { onAdded: (artwork: Artwork) => void; onCancel: () => void }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewUrl, setPreviewUrl] = useState('')

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    if (field === 'imageUrl') {
      // Basic URL preview
      try { new URL(value); setPreviewUrl(value) } catch { setPreviewUrl('') }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.medium.trim()) newErrors.medium = 'Medium is required'
    if (!form.dimensions.trim()) newErrors.dimensions = 'Dimensions are required'
    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) newErrors.price = 'Enter a valid price'
    if (!form.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required'
    else {
      try { new URL(form.imageUrl) } catch { newErrors.imageUrl = 'Enter a valid URL' }
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setSaving(true)
    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          price,
          medium: form.medium.trim(),
          dimensions: form.dimensions.trim(),
          imageUrl: form.imageUrl.trim(),
          isAvailable: true,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        onAdded(data.artwork as Artwork)
        toast({ title: `"${form.title}" added successfully` })
      } else {
        // Show server validation errors
        if (data.details) {
          const serverErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            serverErrors[key] = (msgs as string[]).join(', ')
          }
          setErrors(serverErrors)
        } else {
          toast({ title: data.error || 'Failed to add artwork', variant: 'destructive' })
        }
      }
    } catch {
      toast({ title: 'Connection error', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const inputClass = "bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
  const labelClass = "text-stone-300 text-sm"

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <Card className="border-amber-600/30 bg-stone-900/80">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-amber-400" />
              </div>
              <CardTitle className="text-base text-stone-100">Add New Artwork</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-stone-400 hover:text-stone-200 h-8 w-8 p-0 cursor-pointer">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image preview */}
            {previewUrl && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-stone-800 border border-stone-700">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewUrl('')} />
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-stone-900/80 text-stone-300 border-stone-600 text-[10px]">
                    <ImageIcon className="w-3 h-3 mr-1" />Preview
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className={labelClass}>Title *</Label>
                <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Sunset Over Brooklyn" className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`} autoFocus />
                {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
              </div>

              {/* Medium */}
              <div className="space-y-1.5">
                <Label className={labelClass}>Medium *</Label>
                <Input value={form.medium} onChange={(e) => update('medium', e.target.value)} placeholder="e.g. Oil on canvas" className={`${inputClass} ${errors.medium ? 'border-red-500' : ''}`} />
                {errors.medium && <p className="text-red-400 text-xs">{errors.medium}</p>}
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5">
                <Label className={labelClass}>Dimensions *</Label>
                <Input value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} placeholder="e.g. 18 x 24 in" className={`${inputClass} ${errors.dimensions ? 'border-red-500' : ''}`} />
                {errors.dimensions && <p className="text-red-400 text-xs">{errors.dimensions}</p>}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label className={labelClass}>Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="2500" min="0" step="50" className={`pl-8 ${inputClass} ${errors.price ? 'border-red-500' : ''}`} />
                </div>
                {errors.price && <p className="text-red-400 text-xs">{errors.price}</p>}
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <Label className={labelClass}>Image URL *</Label>
                <Input value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} placeholder="https://..." className={`${inputClass} ${errors.imageUrl ? 'border-red-500' : ''}`} />
                {errors.imageUrl && <p className="text-red-400 text-xs">{errors.imageUrl}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className={labelClass}>Description <span className="text-stone-500">(optional)</span></Label>
                <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell the story behind this piece..." rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><Plus className="w-4 h-4 mr-2" />Add Artwork</>}
              </Button>
              <Button type="button" variant="ghost" onClick={onCancel} className="text-stone-400 hover:text-stone-200 cursor-pointer">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function InquiriesTab() {
  const [data, setData] = useState<PurchaseInquiry[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/api/admin/inquiries').then(r => r.json()).then(d => setData(d.inquiries || [])).finally(() => setLoading(false)) }, [])
  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>
  if (!data.length) return <div className="text-center py-12"><ShoppingBag className="w-10 h-10 text-stone-600 mx-auto mb-3" /><p className="text-stone-400">No purchase inquiries yet.</p></div>
  return <div className="space-y-3">{data.map(i => <Card key={i.id} className="border-stone-800 bg-stone-900/50"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-medium text-stone-100">{i.name}</span><a href={`mailto:${i.email}`} className="text-amber-400 text-sm hover:underline">{i.email}</a></div><p className="text-stone-300 text-sm mt-1.5"><Palette className="w-3.5 h-3.5 text-amber-500/60 inline mr-1" />Interested in: <span className="font-medium text-amber-400">{i.artwork.title}</span> ({fmt(i.artwork.price)})</p>{i.message && <p className="text-stone-400 text-sm mt-1 italic border-l-2 border-amber-600/30 pl-3">{i.message}</p>}</div><span className="text-xs text-stone-500 flex-shrink-0">{fmtDate(i.createdAt)}</span></div></CardContent></Card>)}</div>
}

function ContactsTab() {
  const [data, setData] = useState<ContactSubmission[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch('/api/admin/contacts').then(r => r.json()).then(d => setData(d.contacts || [])).finally(() => setLoading(false)) }, [])
  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>
  if (!data.length) return <div className="text-center py-12"><Mail className="w-10 h-10 text-stone-600 mx-auto mb-3" /><p className="text-stone-400">No contact submissions yet.</p></div>
  return <div className="space-y-3">{data.map(c => <Card key={c.id} className="border-stone-800 bg-stone-900/50"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-medium text-stone-100">{c.name}</span><a href={`mailto:${c.email}`} className="text-amber-400 text-sm hover:underline">{c.email}</a></div><p className="text-stone-300 text-sm mt-2 border-l-2 border-amber-600/30 pl-3">{c.message}</p></div><span className="text-xs text-stone-500 flex-shrink-0">{fmtDate(c.createdAt)}</span></div></CardContent></Card>)}</div>
}

function AdminDashboard() {
  const [artworks, setArtworks] = useState<Artwork[]>([]); const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const fetchArtworks = useCallback(async () => { const r = await fetch('/api/artworks'); const d = await r.json(); return (d.artworks ?? []) as Artwork[] }, [])
  useEffect(() => { fetchArtworks().then(setArtworks).finally(() => setLoading(false)) }, [fetchArtworks])
  const handleUpdate = (id: string, c: Partial<Artwork>) => setArtworks(prev => prev.map(a => a.id === id ? { ...a, ...c } : a))
  const handleDelete = (id: string) => setArtworks(prev => prev.filter(a => a.id !== id))
  const handleAdded = (artwork: Artwork) => { setArtworks(prev => [...prev, artwork]); setShowAddForm(false) }
  const list = artworks ?? []
  const avail = list.filter(a => a.isAvailable)
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur border-b border-stone-800"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between"><div className="flex items-center gap-3"><a href="/" className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"><ArrowLeft className="w-5 h-5" /></a><div><h1 className="text-lg font-semibold font-[family-name:var(--font-playfair)]">Admin Dashboard</h1><p className="text-xs text-stone-500">Marcus Carter Portfolio</p></div></div><a href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"><ExternalLink className="w-3.5 h-3.5" />View Site</a></div></header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Card className="border-stone-800 bg-stone-900/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-400">{list.length}</p><p className="text-xs text-stone-500 mt-1">Total Artworks</p></CardContent></Card>
          <Card className="border-stone-800 bg-stone-900/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{avail.length}</p><p className="text-xs text-stone-500 mt-1">Available</p></CardContent></Card>
          <Card className="border-stone-800 bg-stone-900/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-stone-300">{list.length - avail.length}</p><p className="text-xs text-stone-500 mt-1">Sold</p></CardContent></Card>
          <Card className="border-stone-800 bg-stone-900/50"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-stone-100">{fmt(avail.reduce((s, a) => s + a.price, 0))}</p><p className="text-xs text-stone-500 mt-1">Portfolio Value</p></CardContent></Card>
        </div>
        <Tabs defaultValue="artworks" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-stone-900 border border-stone-800 w-full sm:w-auto">
              <TabsTrigger
                value="artworks"
                className="text-stone-400 data-[state=active]:bg-stone-800 data-[state=active]:text-stone-100 gap-1.5 cursor-pointer"
              >
                <Palette className="w-4 h-4" />Artworks
              </TabsTrigger>
              <TabsTrigger
                value="inquiries"
                className="text-stone-400 data-[state=active]:bg-stone-800 data-[state=active]:text-stone-100 gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />Inquiries
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="text-stone-400 data-[state=active]:bg-stone-800 data-[state=active]:text-stone-100 gap-1.5 cursor-pointer"
              >
                <Mail className="w-4 h-4" />Messages
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="artworks" className="mt-2">
            {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div> : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-400">Click a price to edit. Toggle for sold/available. Arrows to reorder.</p>
                  {!showAddForm && (
                    <Button onClick={() => setShowAddForm(true)} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer gap-1.5">
                      <Plus className="w-4 h-4" />Add Artwork
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <AddArtworkForm onAdded={handleAdded} onCancel={() => setShowAddForm(false)} />
                  )}
                </AnimatePresence>

                {list.map(a => <ArtworkRow key={a.id} artwork={a} onUpdate={handleUpdate} onDelete={handleDelete} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inquiries" className="mt-6"><InquiriesTab /></TabsContent>
          <TabsContent value="contacts" className="mt-6"><ContactsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false); const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true); if (sessionStorage.getItem('admin_auth') === '1') setAuthenticated(true) }, [])
  if (!mounted) return null
  return <AnimatePresence mode="wait">{authenticated ? <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AdminDashboard /></motion.div> : <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoginScreen onAuth={() => setAuthenticated(true)} /></motion.div>}</AnimatePresence>
}