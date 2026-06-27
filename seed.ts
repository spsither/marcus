import { db } from './src/lib/db'

async function seed() {
  const artworks = [
    {
      title: "East Village Nocturne",
      description: "A vibrant exploration of the East Village at night, where neon reflections dance across rain-slicked streets and the energy of the city pulses through every brushstroke. This piece captures the intersection of urban chaos and quiet intimacy that defines downtown Manhattan living.",
      price: 4200,
      medium: "Acrylic on canvas",
      dimensions: "36 x 48 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/7e1f5dd959bc.jpg",
      isAvailable: true,
      sortOrder: 1,
    },
    {
      title: "Diagnostic Dreams II",
      description: "Drawing from four decades of experience in diagnostic imaging, this work transforms the hidden structures of the human body into an abstract landscape of color and form. Radiological patterns merge with emotional depth, creating a visual meditation on what lies beneath the surface.",
      price: 5800,
      medium: "Mixed media on panel",
      dimensions: "40 x 40 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/9d5c9c0d50f0.jpg",
      isAvailable: true,
      sortOrder: 2,
    },
    {
      title: "Empathy in Red",
      description: "A powerful statement piece driven by Carter's deep sense of empathy toward humanity. Bold reds and warm tones dominate the canvas, expressing the belief that kindness will ultimately triumph over adversity. The layered composition reveals new details with each viewing.",
      price: 3600,
      medium: "Oil on canvas",
      dimensions: "30 x 40 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/705ed1e9dc3a.jpg",
      isAvailable: true,
      sortOrder: 3,
    },
    {
      title: "Kandinsky's Ghost",
      description: "A respectful nod to Wassily Kandinsky, one of Carter's greatest influences. This piece explores the synesthetic relationship between color and sound, with geometric forms and flowing lines creating a visual symphony that seems to hum with quiet energy and intention.",
      price: 6500,
      medium: "Acrylic and ink on canvas",
      dimensions: "48 x 48 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/f144456e206b.jpg",
      isAvailable: true,
      sortOrder: 4,
    },
    {
      title: "Basquiat Walks the Village",
      description: "Inspired by Jean-Michel Basquiat's raw, uncompromising vision, this painting channels the spirit of downtown New York's artistic legacy. Text-like markings, crowned figures, and a restless energy pay homage to the streets that shaped a generation of artists.",
      price: 7200,
      medium: "Mixed media on canvas",
      dimensions: "54 x 72 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/97fac242318f.jpg",
      isAvailable: true,
      sortOrder: 5,
    },
    {
      title: "Miró's Garden",
      description: "Drawing from Joan Miró's playful surrealism, this work features whimsical forms and celestial symbols floating across a dreamlike field. The biomorphic shapes and primary colors create a sense of childlike wonder that invites the viewer to see the world through fresh eyes.",
      price: 4900,
      medium: "Acrylic on canvas",
      dimensions: "36 x 36 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/c8170ac594c8.jpg",
      isAvailable: false,
      sortOrder: 6,
    },
    {
      title: "Frequency",
      description: "A meditation on the invisible signals that connect us all — from radio waves to the electromagnetic fields used in diagnostic imaging. Layers of translucent color overlap and interfere, creating patterns that echo the beauty of scientific imagery reimagined as art.",
      price: 5500,
      medium: "Oil and resin on panel",
      dimensions: "42 x 56 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/0efbfd188d43.png",
      isAvailable: true,
      sortOrder: 7,
    },
    {
      title: "Youth Unbound",
      description: "Carter's message to the younger generation takes visual form in this exuberant painting. Bright, unapologetic colors burst from the center of the canvas, symbolizing the untapped potential of youth and the artist's conviction that a bright future awaits those who relish the journey.",
      price: 3800,
      medium: "Acrylic on canvas",
      dimensions: "30 x 30 in",
      imageUrl: "https://sfile.chatglm.cn/images-ppt/bb577fc68ede.png",
      isAvailable: true,
      sortOrder: 8,
    },
  ]

  console.log('Seeding artworks...')
  for (const artwork of artworks) {
    const created = await db.artwork.upsert({
      where: { id: artwork.title.toLowerCase().replace(/\s+/g, '-') },
      update: artwork,
      create: {
        ...artwork,
        id: artwork.title.toLowerCase().replace(/\s+/g, '-'),
      },
    })
    console.log(`  Created: ${created.title}`)
  }
  console.log(`Done! Seeded ${artworks.length} artworks.`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    void db.$disconnect()
  })