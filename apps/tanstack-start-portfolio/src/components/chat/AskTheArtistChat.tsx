import { Link, useMatch } from '@tanstack/react-router';
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
  imageUrl?: string | null;
};

/** Fixed crop so every card image has the same aspect ratio, whatever the painting's format. */
const IMAGE_PARAMS = '?w=480&h=360&fit=crop&auto=format';

/** Rendered for each record the agent returns from the index. */
function ChatItemCard({ item }: { item: ChatItem }) {
  const title = item.title ?? 'Untitled';
  const className = 'block rounded-md border border-border p-3 text-foreground no-underline';

  if (!item.slug) return <div className={className}>{title}</div>;

  const content = (
    <>
      {item.imageUrl ? (
        <img
          src={`${item.imageUrl}${IMAGE_PARAMS}`}
          alt=''
          loading='lazy'
          className='mb-2 aspect-[4/3] w-full rounded-sm object-cover'
        />
      ) : null}
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
 * Renders nothing until `VITE_ALGOLIA_AGENT_ID` is set, and only on the paintings gallery.
 */
export function AskTheArtistChat() {
  const [mounted, setMounted] = useState(false);
  const onGallery = useMatch({ from: '/paintings/', shouldThrow: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !onGallery || !agentId || !searchClient) return null;

  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
      <Chat agentId={agentId} itemComponent={ChatItemCard} translations={translations} />
      <ChatTrigger />
    </InstantSearch>
  );
}
