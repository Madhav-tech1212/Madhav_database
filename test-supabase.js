const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Querying Supabase database...");
  const visitorCount = await prisma.visitor.count();
  console.log("Visitor count in Supabase:", visitorCount);
  
  const visitors = await prisma.visitor.findMany({ take: 5 });
  console.log("Sample visitors:", visitors);

  const sessionCount = await prisma.session.count();
  console.log("Session count in Supabase:", sessionCount);
  
  const pageViewCount = await prisma.pageView.count();
  console.log("PageView count in Supabase:", pageViewCount);
}

main()
  .catch(e => console.error("Database connection error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
