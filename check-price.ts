import { db } from './src/lib/db'

async function check() {
  const a = await db.artwork.findUnique({ where: { id: 'interpreted-space' } })
  console.log(a?.title + ': $' + a?.price)
  await db.$disconnect()
}
check()