import StepController from '@/components/CampaignCreation/Elements/Controller/StepController';
import FormHeader from "@/components/CampaignCreation/Layout/FormHeader";
import FormSteps from '@/components/CampaignCreation/Layout/FormSteps';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { dataBaseService } from '@/HardCode/dataBaseService';
import { Category, User } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { titleForCampaignCreation } from '@/utils/constants';
import { CHEVRON_RIGHT } from '@/utils/images';
import { ROUTES } from '@/utils/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useWalletStore } from 'smart-db';
import styles from '@/pages/campaign/new/CreatorCampaign.module.scss';
import useNew from './useNew';

export default function CreatorCampaign() {
  const { step, isLoading, handleClickBack, newCampaign } = useNew()


  useEffect(() => { console.log(newCampaign) }, [newCampaign])



  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <main className={styles.generalContainer}>
      <section className={styles.layout}>
        <FormHeader />
        <div className={styles.stepController}>
          <h2 className={styles.titleSection}>{titleForCampaignCreation(step) || ''}</h2>
          <StepController step={step} />
        </div>

        <div className={styles.stepContent}>
          <div className={styles.backContainer}>
            <svg width="18" height="18" className={styles.icon} onClick={handleClickBack}>
              <use href={CHEVRON_RIGHT}></use>
            </svg>
          </div>
          <FormSteps />
        </div>
      </section>
    </main>
  );
}



/*     useEffect(() => {
        if (category !== '') {
            const categories = dataBaseService.getCategories();
            const selectedCategory = categories.find((cat: Category) => cat.name === category);
            const category_id = selectedCategory ? selectedCategory.id : null;
            setCategoryId(category_id);
        } else {
            setCategoryId(null);
        }
    }, [category]); 
    
    useEffect(() => {
    setIsLoading(true);
    if (!address) {
      router.push(ROUTES.draft);
      return;
    } else {
      const users = dataBaseService.getUsers();
      const foundUser = users.find((u: User) => u.wallet_address === address);
      if (!foundUser) {
        router.push(ROUTES.draft);
        return;
      }
      setUser(foundUser);
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [address, router]);
    
    */