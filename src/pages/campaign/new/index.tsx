import { useScreenSize } from "@/hooks/useScreenSize";
import styles from "./CreatorCampaign.module.scss";
import { CHEVRON_RIGHT } from "@/utils/images";
import { useSession } from "next-auth/react";
import { useCardano } from "@/contexts/CardanoContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "@/utils/routes";
import StepController from "@/components/campaign/creator/controller/StepController";
import { dataBaseService } from "@/HardCode/dataBaseService";
import { Category, User } from "@/HardCode/databaseType";
import FormSteps from "@/components/campaign/creator/form/FormSteps";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import FormHeader from "@/components/campaign/creator/form/layout/FormHeader";
import MemberController from "@/components/campaign/creator/controller/MemberController";
import { titleForCampaignCreation } from "@/utils/constants";



export default function Home() {
  const screenSize = useScreenSize();
  const { data: session } = useSession();
  const { address } = useCardano();
  const router = useRouter();
  const { step, setStep, category, setUser, isLoading, setCategoryId, setIsLoading, newCampaign } = useCampaignStore();




  const handleClickBack = () => {
    if (step === 1) {
      router.push(ROUTES.draft);
    } else {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

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

  useEffect(() => {
    if (category !== "") {
      const categories = dataBaseService.getCategories();
      const selectedCategory = categories.find(
        (cat: Category) => cat.name === category
      );
      const categoryId = selectedCategory ? selectedCategory.id : null;
      setCategoryId(categoryId);
    } else {
      setCategoryId(null);
    }
  }, [category]);


  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <main className={styles.generalContainer}>
      <section className={styles.layout}>
        <FormHeader session={session} />
        <div className={styles.stepController}>
          <h2
            className={styles.titleSection}
          >{titleForCampaignCreation(step) || ""}</h2>
          <StepController step={step} />
        </div>

        <div className={styles.stepContent}>
          <div className={styles.backContainer}>
            <svg
              width="28"
              height="28"
              className={styles.icon}
              onClick={handleClickBack}
            >
              <use href={CHEVRON_RIGHT}></use>
            </svg>
          </div>
          <FormSteps />
        </div>
      </section>
    </main>
  );
}




