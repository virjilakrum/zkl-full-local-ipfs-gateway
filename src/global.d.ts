/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

declare module '@stablelib/utf8' {
  export function encode(str: string): Uint8Array;
  export function decode(bytes: Uint8Array): string;
}

declare module 'circomlibjs' {
  export function buildMimc7(): Promise<{
    hash: (left: string, right: string) => Promise<bigint>;
    F: any;
  }>;
}