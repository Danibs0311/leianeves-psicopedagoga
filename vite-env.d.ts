/// <reference types="vite/client" />
/// <reference types="react" />

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}
