import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import {
  type PortableTextBlock,
  populateLexicalFromPortableText,
} from '../../../lib/portableTextAdapter';

interface LoadPortableTextPluginProps {
  documentId: string;
  initialBlocks: PortableTextBlock[] | null | undefined;
}

export function LoadPortableTextPlugin({ documentId, initialBlocks }: LoadPortableTextPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastLoadedDocRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastLoadedDocRef.current !== documentId) {
      lastLoadedDocRef.current = documentId;
      populateLexicalFromPortableText(editor, initialBlocks);
    }
  }, [documentId, initialBlocks, editor]);

  return null;
}
