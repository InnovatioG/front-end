import { useScreenSize } from "@/hooks/useScreenSize";
import styles from "./CreatorCampaign.module.scss";
import Link from "next/link";
import Image from "next/image";
import { CHEVRON_RIGHT, LOGO_FULL_DARK } from "@/utils/images";
import BtnConnectWallet from "@/components/buttons/connectWallet/BtnConnectWallet";
import GoogleConnect from "@/components/buttons/googleConnect/GoogleConnect";
import { useSession } from "next-auth/react";
import { useCardano } from "@/contexts/CardanoContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ROUTES } from "@/utils/routes";
import StepController from "@/components/campaign/creator/controller/StepController";
import { dataBaseService } from "@/HardCode/dataBaseService";
import { Category, User } from "@/HardCode/databaseType";
import FormSteps from "@/components/campaign/creator/form/FormSteps";
import LoadingPage from "@/components/LoadingPage/LoadingPage";

export default function Home() {
  const screenSize = useScreenSize();
  const { data: session } = useSession();
  const { address } = useCardano();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleClickContinue = (step: 1 | 2 | 3 | 4) => {
    setStep(step);
  };
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

  const newCampaign = {
    id: Date.now(),
    user_id: user?.id,
    state_id: 1,
    category_id: categoryId,
    contract_id: 2,
    vizualization: 2,
    investors: 0,
    title: title,
    description: description,
    campaign_type: "Milestone", // TODO
    milestones: [
      { order: 1, goal: 200000.0 },
      { order: 2, goal: 400000.0 },
      { order: 3, goal: 800000.0 },
    ], // TODO
    raise_amount: 0,
    start_date: new Date().toISOString(), // TODO
    end_date: "", // TODO
    logo_url: "/img/database/company_logo_id1.png",
    banner_url: "/img/database/banner_logo_id1.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleClickCreate = () => {
    console.log(newCampaign);
    dataBaseService.createCampaign(newCampaign);
    router.push(ROUTES.draft);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.createCampaign}>
      <div className={styles.header}>
        <Link href="/">
          <Image
            height={18}
            width={108}
            src={LOGO_FULL_DARK}
            alt="logo-full"
            className={styles.logo}
            priority
          />
        </Link>
        {session === null ? (
          <BtnConnectWallet type="primary" width={166} />
        ) : (
          <GoogleConnect loggedIn={true} />
        )}
      </div>
      <div className={styles.stepController}>
        <svg
          width="28"
          height="28"
          className={styles.icon}
          onClick={handleClickBack}
        >
          <use href={CHEVRON_RIGHT}></use>
        </svg>
        <h2
          className={styles.titleSection}
        >{`Let's start with the inicial description`}</h2>
        <StepController step={step} />
      </div>
      <div className={styles.stepContent}>
        <FormSteps
          step={step}
          handleContinue={handleClickContinue}
          handleCreate={handleClickCreate}
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
        />
      </div>
    </div>
  );
}
