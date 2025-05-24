'use client';

import { useEffect } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

// The global declaration has been moved to src/elevenlabs.d.ts

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ agentId }) => {
  useEffect(() => {
    // You might need to manually initialize the widget if the script doesn't do it automatically
    // or if it needs to be re-initialized on navigation. 
    // Check ElevenLabs documentation if the widget doesn't appear.
    if (typeof window !== 'undefined' && (window as any).ElevenLabsConvai) {
      // Example: (window as any).ElevenLabsConvai.init(); 
      // This is hypothetical, refer to actual ElevenLabs docs for initialization API.
    }
  }, []);

  return <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>;
}; 