import { useEffect, useState } from 'react';
import { load, Cheerio, CheerioAPI } from 'cheerio';

/**
 *
 * Extracts lyrics from a lyrics page on Genius.com and returns them as a string.
 *
 * @param lyricPageUrl The URL of the lyrics page on Genius.com.
 * @returns
 */
export default function useGeniusLyrics(lyricPageUrl: string) {
  const [lyrics, setLyrics] = useState<string | null>(null);
  useEffect(() => {
    if (lyricPageUrl) {
      fetchAndExtractLyrics(lyricPageUrl).then(lyrics => {
        setLyrics(lyrics);
      });
    } else {
      setLyrics(null);
    }
  }, [lyricPageUrl]);

  return lyrics;
}

export async function fetchAndExtractLyrics(
  geniusLyricPageUrl: string
): Promise<string> {
  const html = await fetchHTML(geniusLyricPageUrl);

  if (html) {
    const lyrics = getLyrics(html);
    if (lyrics) {
      return lyrics;
    } else {
      console.log('Lyrics not found.');
      return '';
    }
  } else {
    console.log('Could not fetch HTML for lyric page URL.');
    return '';
  }
}

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    } else {
      console.error(
        'Error fetching HTML:',
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error('Error fetching HTML:', error);
    return null;
  }
}

import cheerio from 'cheerio';

function getLyrics(lyricPageHtml: string): string {
  // Load the HTML content into Cheerio
  const $ = load(lyricPageHtml);

  // Get the container element
  const container = $("[class^='Lyrics__Container']");

  // Function to recursively process elements and handle nested elements
  function processElement(node: any): string {
    const tagName = node.name?.toLowerCase() ?? '';
    if (tagName === 'a' || tagName === 'span') {
      const innerText = $(node)
        .contents()
        .map((_, el) => {
          if (el.type === 'text') {
            return el.data ?? '';
          } else if (el.type === 'tag') {
            return processElement(el); // Recursively process nested <span> elements
          }
          return '';
        })
        .get()
        .join('');
      return innerText;
    } else if (tagName === 'br') {
      // Handle <br> tags as newline characters
      return '\n';
    } else if (node.type === 'text') {
      // For text nodes
      const textContent = node.data ?? '';
      return textContent.trim();
    }
    return '';
  }

  const lines: string[] = [];

  // Process the selected nodes
  container.contents().each(function () {
    const lineText = processElement(this);
    if (lineText.length > 0) {
      lines.push(lineText);
    }
  });

  const result = lines
    .filter(
      // Remove empty lines if they aren't followed by section headings
      (l, i) =>
        l.trim().length > 0 ||
        (lines[i + 1] &&
          lines[i + 1].startsWith('[') &&
          lines[i + 1].endsWith(']'))
    )
    .join('\n');

  return result;
}
