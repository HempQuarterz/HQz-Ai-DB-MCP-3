import { db } from '../server/db';
import { researchPapers } from '../shared/schema';

/**
 * PubMed Research Paper Automation
 * 
 * This script fetches real research papers about hemp from PubMed's public API
 * and populates your database with authentic research data.
 */

interface PubMedPaper {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubdate: string;
  abstract?: string;
  doi?: string;
}

export async function fetchHempResearchFromPubMed() {
  console.log('Fetching hemp research papers from PubMed...');
  
  const searchTerms = [
    'industrial hemp applications',
    'hemp fiber textile',
    'hemp oil extraction',
    'Cannabis sativa industrial',
    'hemp construction material',
    'hemp bioplastic',
    'hemp protein nutrition'
  ];
  
  for (const term of searchTerms) {
    try {
      console.log(`Searching PubMed for: "${term}"`);
      
      // Step 1: Search PubMed for paper IDs
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmax=20&retmode=json`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (!searchData.esearchresult?.idlist?.length) {
        console.log(`No papers found for term: ${term}`);
        continue;
      }
      
      const paperIds = searchData.esearchresult.idlist;
      console.log(`Found ${paperIds.length} papers for "${term}"`);
      
      // Step 2: Fetch detailed information for each paper
      const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${paperIds.join(',')}&retmode=xml`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsXml = await detailsResponse.text();
      
      // Step 3: Parse and insert papers (simplified XML parsing)
      const papers = await parseePubMedXML(detailsXml);
      
      for (const paper of papers) {
        try {
          await db.insert(researchPapers).values({
            title: paper.title,
            authors: paper.authors.join(', '),
            journal: paper.journal,
            publicationDate: paper.pubdate,
            abstract: paper.abstract || null,
            doi: paper.doi || null,
            citations: null, // Would need additional API call
            keywords: [term], // Tag with search term
            plantTypeId: null, // Could be determined by content analysis
            plantPartId: null,
            industryId: null
          }).onConflictDoNothing(); // Avoid duplicates
          
          console.log(`✓ Inserted: ${paper.title.substring(0, 50)}...`);
        } catch (error) {
          console.error(`Failed to insert paper: ${error}`);
        }
      }
      
      // Rate limiting - PubMed allows 3 requests per second
      await new Promise(resolve => setTimeout(resolve, 350));
      
    } catch (error) {
      console.error(`Error fetching papers for "${term}":`, error);
    }
  }
  
  console.log('PubMed import completed!');
}

// Simplified XML parser for PubMed data
async function parseePubMedXML(xml: string): Promise<PubMedPaper[]> {
  const papers: PubMedPaper[] = [];
  
  // Basic regex parsing (in production, use a proper XML parser)
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];
  
  for (const articleXml of articleMatches) {
    try {
      const pmid = extractXmlContent(articleXml, 'PMID');
      const title = extractXmlContent(articleXml, 'ArticleTitle');
      const journal = extractXmlContent(articleXml, 'Title'); // Journal title
      const pubdate = extractPubDate(articleXml);
      const abstract = extractXmlContent(articleXml, 'AbstractText');
      const doi = extractDOI(articleXml);
      const authors = extractAuthors(articleXml);
      
      if (title && pmid) {
        papers.push({
          pmid,
          title: cleanText(title),
          authors,
          journal: cleanText(journal) || 'Unknown Journal',
          pubdate,
          abstract: abstract ? cleanText(abstract) : undefined,
          doi
        });
      }
    } catch (error) {
      console.error('Error parsing article:', error);
    }
  }
  
  return papers;
}

function extractXmlContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractAuthors(xml: string): string[] {
  const authorMatches = xml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || [];
  const authors: string[] = [];
  
  for (const authorXml of authorMatches) {
    const lastName = extractXmlContent(authorXml, 'LastName');
    const foreName = extractXmlContent(authorXml, 'ForeName');
    
    if (lastName) {
      authors.push(`${foreName} ${lastName}`.trim());
    }
  }
  
  return authors;
}

function extractPubDate(xml: string): string {
  const year = extractXmlContent(xml, 'Year');
  const month = extractXmlContent(xml, 'Month');
  const day = extractXmlContent(xml, 'Day');
  
  if (year) {
    return `${year}-${month.padStart(2, '0') || '01'}-${day.padStart(2, '0') || '01'}`;
  }
  
  return new Date().toISOString().split('T')[0]; // Fallback to today
}

function extractDOI(xml: string): string | undefined {
  const doiMatch = xml.match(/doi:\s*([^\s<]+)/i);
  return doiMatch ? doiMatch[1] : undefined;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

// Run the script
fetchHempResearchFromPubMed()
  .then(() => console.log('Script completed successfully'))
  .catch(error => console.error('Script failed:', error));