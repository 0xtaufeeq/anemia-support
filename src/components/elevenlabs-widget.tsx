'use client';

import { useEffect, useState } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

// The global declaration has been moved to src/elevenlabs.d.ts

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ agentId }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're only running on the client
    setIsClient(true);
    
    // You might need to manually initialize the widget if the script doesn't do it automatically
    // or if it needs to be re-initialized on navigation. 
    // Check ElevenLabs documentation if the widget doesn't appear.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ElevenLabsConvai) {
      // Example: (window as any).ElevenLabsConvai.init(); 
      // This is hypothetical, refer to actual ElevenLabs docs for initialization API.
    }
  }, []);

  // Only render on the client to prevent SSR issues
  if (!isClient) {
    return null;
  }

  return <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>;
}; 