export function WebSiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Prompts34',
    url: 'https://prompts34.com',
    description: "Türkiye'nin en kapsamlı yapay zeka prompt kütüphanesi",
    inLanguage: 'tr-TR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://prompts34.com/prompts?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PromptStructuredData({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url,
    inLanguage: 'tr-TR',
    datePublished,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Prompts34',
      url: 'https://prompts34.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function DefinedTermStructuredData({
  term,
  description,
  url,
  alternateName,
}: {
  term: string;
  description: string;
  url: string;
  alternateName?: string[];
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description,
    url,
    ...(alternateName && alternateName.length > 0 ? { alternateName } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Prompts34 Yapay Zeka Sözlüğü',
      url: 'https://prompts34.com/sozluk',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function HowToStructuredData({
  name,
  description,
  url,
  steps,
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  steps: Array<{ name: string; text: string }>;
  datePublished?: string;
  dateModified?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    inLanguage: 'tr-TR',
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${url}#adim-${index + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function FAQPageStructuredData({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ArticleStructuredData({
  headline,
  description,
  url,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    inLanguage: 'tr-TR',
    datePublished,
    dateModified: dateModified ?? datePublished,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Prompts34',
      url: 'https://prompts34.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function CollectionPageStructuredData({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: 'tr-TR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Prompts34',
      url: 'https://prompts34.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
