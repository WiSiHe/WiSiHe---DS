import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Chat, ChatTrigger, InstantSearch } from 'react-instantsearch';
import 'instantsearch.css/components/chat.css';
import { ALGOLIA_INDEX_NAME } from '@/lib/algolia/constants';
import { searchClient } from '@/lib/algolia/searchClient';

const agentId = import.meta.env.VITE_ALGOLIA_AGENT_ID?.trim() ?? '';

type ChatItem = {
  objectID: string;
  _type?: string;
  title?: string;
  slug?: string;
  medium?: string;
};

/** Rendered for each record the agent returns from the index. */
function ChatItemCard({ item }: { item: ChatItem }) {
  const title = item.title ?? 'Untitled';
  const className = 'block rounded-md border border-border p-3 text-foreground no-underline';

  if (!item.slug) return <div className={className}>{title}</div>;

  const content = (
    <>
      <strong>{title}</strong>
      {item.medium ? <span className='block text-sm opacity-70'>{item.medium}</span> : null}
    </>
  );

  return item._type === 'recipe' ? (
    <Link to='/recipes/$slug' params={{ slug: item.slug }} className={className}>
      {content}
    </Link>
  ) : (
    <Link to='/paintings/$slug' params={{ slug: item.slug }} className={className}>
      {content}
    </Link>
  );
}

const translations = {
  header: { title: 'Ask about the art' },
};

/**
 * Floating chat panel backed by an Algolia Agent Studio agent that searches the
 * `wisihe-search` index. Client-only: the widget keeps its state in sessionStorage and the
 * agent talks to Algolia straight from the browser with the search-only key.
 * Renders nothing until `VITE_ALGOLIA_AGENT_ID` is set.
 */
export function AskTheArtistChat() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !agentId || !searchClient) return null;

  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
      <Chat agentId={agentId} itemComponent={ChatItemCard} translations={translations} />
      <ChatTrigger />
    </InstantSearch>
  );
}
