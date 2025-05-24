import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: '10mb',
  //   },
  // },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add more comprehensive fallbacks for browser APIs
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        DOMMatrix: false,
        DOMPoint: false,
        DOMPointReadOnly: false,
        DOMRect: false,
        DOMRectReadOnly: false,
        TextEncoder: false,
        TextDecoder: false,
        // Add more DOM APIs that might be causing issues
        window: false,
        document: false,
        navigator: false,
        location: false,
        history: false,
        File: false,
        FileList: false,
        FileReader: false,
        Blob: false,
        URL: false,
        URLSearchParams: false,
        Element: false,
        HTMLElement: false,
        Event: false,
        EventTarget: false,
        CustomEvent: false,
        MessageEvent: false,
        WebSocket: false,
        XMLHttpRequest: false,
        fetch: false,
        Request: false,
        Response: false,
        Headers: false,
      };
    }

    return config;
  },
};

export default nextConfig;
