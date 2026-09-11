/**
 * Type declarations for packages that don't ship their own types.
 */

// 'cn' package — simple classname concatenation utility used by shadcn/ui v4
declare module "cn" {
  export function cn(...inputs: unknown[]): string;
}
