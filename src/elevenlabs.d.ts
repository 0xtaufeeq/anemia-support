// src/elevenlabs.d.ts
import 'react'; // Import React to ensure JSX namespace is correctly augmented

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
      };
    }
  }
}

export {}; // Ensures this file is treated as a module