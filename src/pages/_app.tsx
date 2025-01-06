import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import * as Images from '@/utils/images';
import { useState, useEffect } from 'react';
import PreLoadingPage from '@/components/General/elements/PreLoadingPage/PreLoadingPage';
import { CardanoProvider } from '@/contexts/CardanoContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { ModalManager } from '@/components/ui/modal/ModalManager';
import Header from '@/components/layout/Header/Header';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { dataBaseService } from '@/HardCode/dataBaseService';
import Footer from '@/components/layout/Footer/Footer';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ROUTES } from '@/utils/routes';
import { StoreProvider } from 'easy-peasy';
import { Session } from 'next-auth';
import { AppGeneral, globalStore } from 'smart-db';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

type ImageType = string | { [key: string]: string };

const getResourcesFromImages = (images: { [key: string]: ImageType }): string[] => {
    return Object.values(images).flatMap((value): string[] => {
        if (typeof value === 'string') {
            return [value];
        } else if (typeof value === 'object') {
            return Object.values(value);
        }
        return [];
    });
};

const resourcesToPreload = getResourcesFromImages(Images);

export default function App({ Component, pageProps }: AppProps<{ session?: Session }>) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    /*     useEffect(() => {
            const initialize = async () => {
                await dataBaseService.initializeData();
    
                // Wait for appStore to complete its initialization
                const checkInit = async () => {
                    console.log('Waiting for appStore to complete its initialization');
                    while (!globalStore.getState().swInitApiCompleted) {
                        await new Promise((resolve) => setTimeout(resolve, 100)); // Poll every 100ms
                    }
                };
    
                await Promise.all([checkInit()]);
                setIsLoading(false);
            };
    
            initialize();
        }, []); */

    if (isLoading) {
        return <PreLoadingPage onLoadComplete={() => setIsLoading(false)} resources={resourcesToPreload} />;
    }

    return (
        <>
            <Head>
                <meta name="application-name" content="Innovatio App" />
                <meta
                    name="description"
                    content="Help different crowdfunding campaigns become a reality thanks to your contributions, invest in projects, fund purposes and get rewards."
                />
                <meta name="keywords" content="innovatio, crowdfunding, invest" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <ReactNotifications />
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <StoreProvider store={globalStore}>
                    <AppGeneral />
                    <ResponsiveProvider>
                        <CardanoProvider>
                            <ModalProvider>
                                <ModalManager />
                                {router.pathname !== ROUTES.new && <Header />}
                                <Component {...pageProps} />
                                {router.pathname !== ROUTES.new && <Footer />}
                            </ModalProvider>
                        </CardanoProvider>
                    </ResponsiveProvider>
                </StoreProvider>
            </SessionProvider>
        </>
    );
}
