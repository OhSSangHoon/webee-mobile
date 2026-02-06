import type { NewsItem } from '@/types/news';

const parseXMLtoResults = (xmlText: string): NewsItem[] => {
  const newsList: NewsItem[] = [];

  try {
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    let itemCount = 0;
    while ((match = itemRegex.exec(xmlText)) !== null && itemCount < 20) {
      const itemXml = match[1];

      const title = extractContent(itemXml, 'title') || "";
      const link = extractContent(itemXml, 'link') || "";
      const pubDate = extractContent(itemXml, 'pubDate') || "";
      const rawDescription = extractContent(itemXml, 'description') || "";
      const description = stripHtmlTags(rawDescription);
      const source = extractContent(itemXml, 'source') || "뉴스";

      if (title && link) {
        newsList.push({ title, link, pubDate, description, source });
        itemCount++;
      }
    }
  } catch (error) {
    console.error('XML parsing error:', error);
  }

  return newsList;
};

const extractContent = (xml: string, tag: string): string => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return "";

  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
};

const stripHtmlTags = (html: string): string => {
  return html
    // 먼저 HTML 엔티티 디코딩
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    // 그 다음 HTML 태그 제거
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ') // 연속 공백 정리
    .trim();
};

const newsCache = new Map<string, { data: NewsItem[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 10;

export async function fetchGoogleNews(query: string): Promise<NewsItem[]> {
  if (newsCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = newsCache.keys().next().value;
    if (oldestKey) {
      newsCache.delete(oldestKey);
    }
  }

  const cached = newsCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=ko&gl=KR&ceid=KR:ko`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(rssUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const xmlText = await res.text();
    const newsList = parseXMLtoResults(xmlText);

    newsCache.set(query, { data: newsList, timestamp: Date.now() });

    return newsList;
  } catch (error) {
    console.error('News fetch error:', error);

    const cached = newsCache.get(query);
    if (cached) {
      return cached.data;
    }

    throw new Error('뉴스를 불러오는데 실패했습니다.');
  }
}
