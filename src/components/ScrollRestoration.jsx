import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
    const { pathname } = useLocation();
    const scrollPositions = useRef({});

    useEffect(() => {
        if (scrollPositions.current[pathname] !== undefined) {
            window.scrollTo(0, scrollPositions.current[pathname]);
        } else {
            window.scrollTo(0, 0);
        }

        const handleScroll = () => {
            scrollPositions.current[pathname] = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            scrollPositions.current[pathname] = window.scrollY;
        };
    }, [pathname]);

    return null;
};

export default ScrollRestoration;