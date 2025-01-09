import PreLoadingPage from '@/components/General/Elements/PreLoadingPage/PreLoadingPage';
import Footer from '@/components/Layout/Footer/Footer';
import Header from '@/components/Layout/Header/Header';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { ModalProvider } from '@/contexts/ModalContext';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { fetchAllData } from '@/store/generalConstants/actions';
import '@/styles/globals.scss';
import * as Images from '@/utils/images';
import { ROUTES } from '@/utils/routes';
import { StoreProvider } from 'easy-peasy';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { AppGeneral, globalStore } from 'smart-db';
import 'smart-db/dist/styles.css';

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
    const [isLoadingResources, setIsLoadingResources] = useState(true);
    const [isLoadingDatabaseService, setIsLoadingDatabaseService] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            await fetchAllData();
            setIsLoadingDatabaseService(false);
        };
        initialize();
    }, []);

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
                    <AppGeneral loader={<LoadingPage />}>
                        {isLoadingResources || isLoadingDatabaseService ? (
                            <PreLoadingPage onLoadComplete={() => setIsLoadingResources(false)} resources={resourcesToPreload} />
                        ) : (
                            <ResponsiveProvider>
                                <ModalProvider>
                                    {router.pathname !== ROUTES.new && <Header />}
                                    <Component {...pageProps} />
                                    {router.pathname !== ROUTES.new && <Footer />}
                                </ModalProvider>
                            </ResponsiveProvider>
                        )}
                    </AppGeneral>
                </StoreProvider>
            </SessionProvider>
        </>
    );
}
