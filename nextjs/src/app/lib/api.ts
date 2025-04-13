
const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001/api';

/**
 * API klient pro komunikaci s externím Payload CMS
 */
export const api = {

  async getPageBySlug(slug: string, options: {
    depth?: number,
    draft?: boolean,
    locale?: string
  } = {}) {
    const url = new URL(`${API_URL}/pages`);

    // Základní nastavení query parametrů
    url.searchParams.append('where', JSON.stringify({
      slug: {
        equals: slug
      }
    }));
    url.searchParams.append('limit', '1');

    // Přidání dalších query parametrů
    if (options.depth !== undefined) url.searchParams.append('depth', options.depth.toString());
    if (options.draft !== undefined) url.searchParams.append('draft', options.draft.toString());
    if (options.locale !== undefined) url.searchParams.append('locale', options.locale);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page by slug: ${response.status}`);
    }

    const data = await response.json();

    // Vrácení první stránky nebo null, pokud nebyla nalezena
    return data.docs.length > 0 ? data.docs[0] : null;
  },


  /**
   * Získá stránku podle ID
   */
  async getPage(id: string, options: {
    depth?: number,
    draft?: boolean,
    locale?: string
  } = {}) {
    const url = new URL(`${API_URL}/pages/${id}`);
    
    // Přidání query parametrů
    if (options.depth !== undefined) url.searchParams.append('depth', options.depth.toString());
    if (options.draft !== undefined) url.searchParams.append('draft', options.draft.toString());
    if (options.locale !== undefined) url.searchParams.append('locale', options.locale);
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache po dobu 60 sekund, případně můžete nastavit 'no-store'
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * Získá seznam stránek
   */
  async getPages(options: {
    limit?: number,
    page?: number,
    sort?: string,
    where?: any,
    depth?: number
  } = {}) {
    const url = new URL('http://localhost:3001/api/pages');
    
    // Přidání query parametrů
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.status}`);
    }
    
    return response.json();
  }
};