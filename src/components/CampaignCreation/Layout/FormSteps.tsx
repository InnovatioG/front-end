import StepOne from "./Form/One/StepOne";
import StepTwo from "@/components/CampaignCreation/Layout/Form/Two/StepTwo";
import StepThree from "@/components/CampaignCreation/Layout/Form/Three/StepThree";
import StepFour from "@/components/CampaignCreation/Layout/Form/Four/StepFour";
import { useCampaignStore } from "@/store/campaign/useCampaignStore";

const stepComponents = {
  1: StepOne,
  2: StepTwo,
  3: StepThree,
  4: StepFour,
};

export default function FormSteps() {
  const { step } = useCampaignStore();
  const StepComponent = stepComponents[step];

  return StepComponent ? <StepComponent /> : <div>FormSteps</div>;
}