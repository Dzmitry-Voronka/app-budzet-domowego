export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Kategorie</h1>
          <p className="text-muted-foreground">Zarządzaj kategoriami wydatków i przychodów</p>
        </div>
        <Link href="/categories/new" className="btn">Nowa kategoria</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm p-6 border border-border">
            <h3>{c.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
