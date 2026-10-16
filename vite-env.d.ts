/// <reference types="vite/client" />
/// <reference types="react" />

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'behold-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'feed-id': string }, HTMLElement>;
            [elemName: string]: any;
        }
    }
}

declare namespace JSX {
    interface IntrinsicElements {
        'behold-widget': any;
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
