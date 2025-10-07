// src/config.ts

/// <reference types="vite/client" />

// Remove custom ImportMetaEnv and ImportMeta interfaces, Vite provides types for import.meta.env


export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  imageKitPublicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ?? '',
  imageKitUrlEndpoint: import.meta.env.VITE_IMAGEKIT_ENDPOINT_URL ?? ''
};
