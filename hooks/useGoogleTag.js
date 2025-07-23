'use client'

import { useEffect } from 'react';

const useGoogleTag = () => {
    useEffect(() => {
        if (!window.dataLayer) {
            window.dataLayer = window.dataLayer || []
        }

        window.gtag = function () {
            window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());

        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js`;

        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(gtagScript, firstScript);

        return () => {
            // Remove the script tag when the component is unmounted
            if (gtagScript.parentNode) {
                gtagScript.parentNode.removeChild(gtagScript);
            }
        };
    }, []);
};

const setGoogleTag = (trackingId) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('config', trackingId);
    }
};

export { setGoogleTag, useGoogleTag };

