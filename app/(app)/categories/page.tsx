export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { subcategories: { where: { isActive: true }, orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return <CategoriesClient initialCategories={categories} />;
}
