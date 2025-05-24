// src/elevenlabs.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 
        'agent-id'?: string; 
      };
    }
  }
}

// Adding an empty export {} to make it a module, which can sometimes help with global type recognition.
export {}; 