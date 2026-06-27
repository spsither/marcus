import { db } from './src/lib/db'

async function check() {
  const contacts = await db.contactSubmission.findMany()
  const inquiries = await db.purchaseInquiry.findMany({ include: { artwork: true } })
  console.log('=== CONTACT SUBMISSIONS ===')
  console.log(JSON.stringify(contacts, null, 2))
  console.log('=== PURCHASE INQUIRIES ===')
  console.log(JSON.stringify(inquiries, null, 2))
  await db.$disconnect()
}

check()