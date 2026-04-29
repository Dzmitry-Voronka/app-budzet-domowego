export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerUserId } from "@/lib/server-auth";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const userId = await getServerUserId();

  const categories = await prisma.category.findMany({
    where: { OR: [{ userId }, { userId: null }], isActive: true },
    include: { subcategories: { where: { isActive: true }, orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return <CategoriesClient initialCategories={categories} />;
}
