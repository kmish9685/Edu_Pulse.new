// reliable-types.d.ts
declare module 'class-variance-authority' {
    import { ClassValue } from 'clsx';
    export type VariantProps<T> = any;
    export function cva(base?: any, config?: any): (props?: any) => string;
}

declare module 'qrcode.react' {
    import * as React from 'react';
    export const QRCodeSVG: React.FC<any>;
    export const QRCodeCanvas: React.FC<any>;
}
