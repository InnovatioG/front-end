import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useEffect } from 'react';

interface LoadingPageProps {
    onLoadComplete: () => void;
    resources: string[];
}

const PreLoadingPage: React.FC<LoadingPageProps> = ({ onLoadComplete, resources }) => {
    useEffect(() => {
        const preloadResources = async () => {
            const loadPromises = resources.map((src) => {
                return new Promise<void>((resolve) => {
                    if (src.endsWith('.svg')) {
                        fetch(src)
                            .then(() => {
                                resolve();
                            })
                            .catch(() => {
                                console.error(`Failed to load SVG: ${src}`);
                                resolve();
                            });
                    } else {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => {
                            resolve();
                        };
                        img.onerror = () => {
                            console.error(`Failed to load image: ${src}`);
                            resolve();
                        };
                    }
                });
            });

            await Promise.all(loadPromises);
            onLoadComplete();
        };

        preloadResources();
    }, [resources, onLoadComplete]);

    return <LoadingPage />;
};

export default PreLoadingPage;
