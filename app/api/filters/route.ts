import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    console.log('Fetching filters for category:', categoryId);

    if (!categoryId) {
      return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
    }

    // First, get all active products in this category
    const products = await prisma.nokta_urunler.findMany({
      where: {
        KategoriID: parseInt(categoryId),
        web_net: true // Only active products
      },
      select: {
        id: true
      }
    });

    console.log(`Found ${products.length} products in category`);

    if (products.length === 0) {
      return NextResponse.json({ success: true, filters: [] });
    }

    // Get all filter values used by these products
    const productFilterRels = await prisma.products_filter_rel.findMany({
      where: {
        product_id: {
          in: products.map(p => p.id)
        },
        filter_value_id: {
          not: null
        }
      },
      select: {
        filter_value_id: true
      }
    });

    console.log(`Found ${productFilterRels.length} filter relations`);

    if (productFilterRels.length === 0) {
      return NextResponse.json({ success: true, filters: [] });
    }

    // Get the unique filter values, filtering out any null values
    const filterValueIds = [...new Set(productFilterRels
      .map(rel => rel.filter_value_id)
      .filter((id): id is number => id !== null)
    )];

    // Get the filter values with their titles
    const filterValues = await prisma.filter_value.findMany({
      where: {
        id: {
          in: filterValueIds
        }
      },
      select: {
        id: true,
        filter_title_id: true,
        name: true,
        name_cn: true
      }
    });

    console.log(`Found ${filterValues.length} filter values`);

    // Get unique filter title IDs, filtering out any null values
    const filterTitleIds = [...new Set(filterValues
      .map(value => value.filter_title_id)
      .filter((id): id is number => id !== null)
    )];

    // Get the filter titles
    const filterTitles = await prisma.filter_title.findMany({
      where: {
        id: {
          in: filterTitleIds
        }
      },
      select: {
        id: true,
        title: true,
        title_en: true
      }
    });

    console.log(`Found ${filterTitles.length} filter titles`);

    // Count how many products use each filter value
    const filterValueCounts = await prisma.products_filter_rel.groupBy({
      by: ['filter_value_id'],
      where: {
        product_id: {
          in: products.map(p => p.id)
        },
        filter_value_id: {
          not: null
        }
      },
      _count: {
        filter_value_id: true
      }
    });

    // Create a map of filter value counts
    const valueCountMap = new Map(
      filterValueCounts.map(count => [
        count.filter_value_id,
        count._count.filter_value_id
      ])
    );

    // Organize the data
    const filters = filterTitles.map(title => ({
      id: title.id,
      title: title.title || '',
      title_en: title.title_en || '',
      values: filterValues
        .filter(value => value.filter_title_id === title.id)
        .map(value => ({
          ...value,
          product_count: valueCountMap.get(value.id) || 0
        }))
        .filter(value => value.product_count > 0) // Only include values that are actually used
    })).filter(filter => filter.values.length > 0); // Only include filters that have values

    console.log('Organized filters:', filters);

    return NextResponse.json({
      success: true,
      filters
    });

  } catch (error) {
    console.error('Error in filters API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 