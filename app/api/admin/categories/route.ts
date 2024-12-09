import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Category {
  id: number
  KategoriAdiTr: string
  parent_id: number | null
  children?: Category[]
}

function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>()
  const roots: Category[] = []

  // First, create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // Then, build the tree structure
  categories.forEach(category => {
    const currentCategory = categoryMap.get(category.id)!
    if (category.parent_id === null || category.parent_id === 0) {
      roots.push(currentCategory)
    } else {
      const parentCategory = categoryMap.get(category.parent_id)
      if (parentCategory) {
        if (!parentCategory.children) {
          parentCategory.children = []
        }
        parentCategory.children.push(currentCategory)
      }
    }
  })

  return roots
}

export async function GET() {
  try {
    const categories = await prisma.nokta_kategoriler.findMany({
      where: {
        is_active: true
      },
      select: {
        id: true,
        KategoriAdiTr: true,
        parent_id: true
      },
      orderBy: {
        sira: 'asc'
      }
    })

    const categoryTree = buildCategoryTree(categories)
    return NextResponse.json(categoryTree)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    )
  }
}