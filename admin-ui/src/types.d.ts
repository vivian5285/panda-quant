declare module "@mui/x-data-grid";
declare module "web-vitals" {
  export function onCLS(callback: (metric: any) => void): void;
  export function onFID(callback: (metric: any) => void): void;
  export function onFCP(callback: (metric: any) => void): void;
  export function onLCP(callback: (metric: any) => void): void;
  export function onTTFB(callback: (metric: any) => void): void;
}

declare module "@mui/material/styles/createTypography" {
  export interface TypographyVariantsOptions {
    [key: string]: any;
  }
}

// 添加其他缺失的类型声明
declare module "@/utils/api";
declare module "@/utils/date";
declare module "@/utils/currency"; 