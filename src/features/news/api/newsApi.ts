import type { NewsItem } from "../model/types";

const parseXMLtoResults = (xmlText: string): NewsItem[] => {
  const newsList: NewsItem[] = [];

  try {
    // 성능 최적화된 XML 파싱
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    // 최대 20개만 파싱하여 성능 향상
    let itemCount = 0;
    while ((match = itemRegex.exec(xmlText)) !== null && itemCount < 20) {
      const itemXml = match[1];

      const title = extractContent(itemXml, 'title') || "";
      const link = extractContent(itemXml, 'link') || "";
      const pubDate = extractContent(itemXml, 'pubDate') || "";
      const description = extractContent(itemXml, 'description') || "";

      if (title && link) {
        newsList.push({ title, link, pubDate, description });
        itemCount++;
      }
    }
  } catch (error) {
    console.error('XML parsing error:', error);
  }

  return newsList;
};

// 캐시 성능 최적화
const extractContent = (xml: string, tag: string): string => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return "";

  // CDATA 처리 최적화
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
};

// 메모리 효율적인 캐시
const newsCache = new Map<string, { data: NewsItem[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분
const MAX_CACHE_SIZE = 10; // 최대 캐시 항목 수

export const fetchGoogleNews = async (query: string): Promise<NewsItem[]> => {
  // 캐시 크기 관리
  if (newsCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = newsCache.keys().next().value;
    if (oldestKey) {
      newsCache.delete(oldestKey);
    }
  }

  // 캐시 확인
  const cached = newsCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=ko&gl=KR&ceid=KR:ko`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

    const res = await fetch(`https://corsproxy.io/?${rssUrl}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const xmlText = await res.text();
    const newsList = parseXMLtoResults(xmlText);

    // 캐시에 저장
    newsCache.set(query, { data: newsList, timestamp: Date.now() });

    return newsList;
  } catch (error) {
    console.error('News fetch error:', error);

    // 에러 시 캐시된 데이터라도 반환
    const cached = newsCache.get(query);
    if (cached) {
      return cached.data;
    }

    throw new Error('뉴스를 불러오는데 실패했습니다.');
  }
};
