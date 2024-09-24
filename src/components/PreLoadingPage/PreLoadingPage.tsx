import { useEffect } from "react";
import styles from "./PreLoadingPage.module.scss";
import NextImage from "next/image";
import { LOGO } from "@/utils/images";

interface LoadingPageProps {
  onLoadComplete: () => void;
  resources: string[];
}

const PreLoadingPage: React.FC<LoadingPageProps> = ({
  onLoadComplete,
  resources,
}) => {
  useEffect(() => {
    const preloadResources = async () => {
      const loadPromises = resources.map((src) => {
        return new Promise<void>((resolve) => {
          if (src.endsWith(".svg")) {
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

  return (
    <div className={styles.loadingPage}>
      <div className={styles.logoContainer}>
        <NextImage src={LOGO} width={50} height={50} alt="logo" priority/>
      </div>
    </div>
  );
};

export default PreLoadingPage;
