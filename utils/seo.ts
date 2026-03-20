export const setDynamicSEO = (title: string, description: string, imageUrl?: string) => {
    document.title = title;
    
    const setMeta = (name: string, content: string, isProperty = false) => {
        const attribute = isProperty ? 'property' : 'name';
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('description', description);
    
    // Open Graph / WhatsApp / Facebook
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', window.location.href, true);
    
    if (imageUrl) {
        // WhatsApp requires absolute URLs for images
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
        setMeta('og:image', fullImageUrl, true);
        setMeta('twitter:image', fullImageUrl, false);
    }
    
    // Twitter
    setMeta('twitter:card', 'summary_large_image', false);
    setMeta('twitter:title', title, false);
    setMeta('twitter:description', description, false);
};
