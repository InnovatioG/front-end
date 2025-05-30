import LoadingPage from '@/components/GeneralOK/LoadingPage/LoadingPage';
import PreLoadingPage from '@/components/GeneralOK/LoadingPage/PreLoadingPage';
import Footer from '@/components/Layout/Footer/Footer';
import Header from '@/components/Layout/Header/Header';
import { ModalProvider } from '@/contexts/ModalProvider';
import { ResponsiveProvider } from '@/contexts/ResponsiveProvider';
import { fetchGeneralStoreData, useGeneralStore } from '@/store/generalStore/useGeneralStore';
import '@/styles/globals.scss';
import * as Images from '@/utils/constants/images';
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
    const [isLoadingApp, setIsLoadingApp] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            await fetchGeneralStoreData();
        };
        if (isLoadingApp === false) {
            initialize();
        }
    }, [isLoadingApp]);

    const { isProtocolTeam, _DebugIsProtocolTeam, _DebugIsAdmin, _DebugIsEditor, setDebugIsAdmin, setDebugIsEditor, setDebugIsProtocolTeam, setShowDebug, showDebug } =
        useGeneralStore();

    useEffect(() => {
        const { isAdmin, isEditor, isProtocolTeam, showDebug } = router.query;

        if (isAdmin === 'true' || isAdmin === 'false') {
            setDebugIsAdmin(isAdmin === 'true');
        }

        if (isEditor === 'true' || isEditor === 'false') {
            setDebugIsEditor(isEditor === 'true');
        }

        if (isProtocolTeam === 'true' || isProtocolTeam === 'false') {
            setDebugIsProtocolTeam(isProtocolTeam === 'true');
        }

        if (showDebug === 'true' || showDebug === 'false') {
            setShowDebug(showDebug === 'true');
        }
    }, [router.query, setDebugIsAdmin, setDebugIsEditor, setDebugIsProtocolTeam, setShowDebug]);

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
                    <AppGeneral loader={<LoadingPage />} onLoadComplete={() => setIsLoadingApp(false)}>
                        {isLoadingApp || isLoadingResources || useGeneralStore.getState().isLoadingStoreData === true ? (
                            <PreLoadingPage onLoadComplete={() => setIsLoadingResources(false)} resources={resourcesToPreload} />
                        ) : (
                            <ResponsiveProvider>
                                <ModalProvider>
                                    <Header />
                                    {showDebug &&
                                        `DEBUG - isProtocolTeam: ${isProtocolTeam} - _DebugIsProtocolTeam: ${_DebugIsProtocolTeam} -_DebugIsAdmin: ${_DebugIsAdmin} - _DebugIsEditor: ${_DebugIsEditor}`}
                                    <Component {...pageProps} />
                                    <Footer />
                                </ModalProvider>
                            </ResponsiveProvider>
                        )}
                    </AppGeneral>
                </StoreProvider>
            </SessionProvider>
        </>
    );
}
