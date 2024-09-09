import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import * as Images from '@/utils/images';
import { useState, useEffect } from 'react';
import PreLoadingPage from "@/components/PreLoadingPage/PreLoadingPage";
import { CardanoProvider } from "@/contexts/CardanoContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { ModalManager } from "@/components/ModalManager";
import Header from "@/components/layout/Header/Header";
import { ResponsiveProvider } from "@/contexts/ResponsiveContext";
import { dataBaseService } from "@/HardCode/dataBaseService";
import Footer from "@/components/layout/Footer/Footer";

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

export default function App({ Component, pageProps }: AppProps) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 1000));
    
    Promise.all([minLoadTime]).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    dataBaseService.initializeData();
  }, []);

  if (isLoading) {
    return <PreLoadingPage onLoadComplete={() => setIsLoading(false)} resources={resourcesToPreload} />;
  }

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Help different crowdfunding campaigns become a reality thanks to your contributions, invest in projects, fund purposes and get rewards."
        />
        <meta name="application-name" content="Innovatio App" />
        <meta name="keywords" content="innovatio, crowdfunding, invest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ResponsiveProvider>
        <CardanoProvider>
          <ModalProvider>
            <ModalManager />
            <Header />
            <Component {...pageProps} />
            <Footer />
          </ModalProvider>
        </CardanoProvider>
      </ResponsiveProvider>

    </>
  );
}

