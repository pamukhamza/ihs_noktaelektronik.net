import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface SearchProduct {
  id: number;
  UrunAdiTR: string;
  UrunAdiEN: string;
  UrunKodu: string;
  seo_link: string;
  MarkaID: number;
  marka_id: number | null;
  marka_title: string | null;
  marka_seo_link: string | null;
  KResim: string | null;
  relevance: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    // Split the search query into individual words and create patterns for each
    const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
    const searchPatterns = searchTerms.map(term => `%${term}%`);

    // Create the dynamic WHERE clause for each search term
    const whereConditions = searchTerms.map(() => `
      (
        n.UrunAdiTR LIKE ? OR
        n.UrunAdiEN LIKE ? OR
        n.UrunKodu LIKE ? OR
        m.title LIKE ?
      )
    `).join(' AND ');

    // Create the parameter array for the query
    // For each term, we need 4 parameters (one for each LIKE condition)
    const queryParams = searchPatterns.flatMap(pattern => [pattern, pattern, pattern, pattern]);
    queryParams.push(limit.toString()); // Add the limit parameter

    // Using LIKE for search with multiple terms
    const products = await prisma.$queryRawUnsafe<SearchProduct[]>(`
      SELECT DISTINCT
        n.id,
        n.UrunAdiTR,
        n.UrunAdiEN,
        n.UrunKodu,
        n.seo_link,
        n.MarkaID,
        r.KResim,
        m.id as marka_id,
        m.title as marka_title,
        m.seo_link as marka_seo_link,
        1 as relevance
      FROM nokta_urunler n
      LEFT JOIN nokta_urun_markalar m ON n.MarkaID = m.id
      LEFT JOIN nokta_urunler_resimler r ON n.id = r.UrunID AND r.sira = 1
      WHERE 
        n.aktif = true
        AND (${whereConditions})
      LIMIT ?
    `, ...queryParams);

    // Transform the raw results to match the expected format
    const formattedProducts = (products || []).map((product) => ({
      id: product.id,
      UrunAdiTR: product.UrunAdiTR,
      UrunAdiEN: product.UrunAdiEN,
      UrunKodu: product.UrunKodu,
      seo_link: product.seo_link,
      KResim: product.KResim,
      marka: product.marka_id ? {
        id: product.marka_id,
        title: product.marka_title,
        seo_link: product.marka_seo_link
      } : null
    }));

    return new Response(JSON.stringify({ products: formattedProducts }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Search API Error:', error instanceof Error ? error.message : 'Unknown error');
    
    return new Response(
      JSON.stringify({ 
        products: [],
        error: 'An error occurred while searching products'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}