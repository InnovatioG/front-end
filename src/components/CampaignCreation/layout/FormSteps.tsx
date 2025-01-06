import StepOne from "./form/one/StepOne";
import StepTwo from "@/components/CampaignCreation/layout/form/two/StepTwo";
import StepThree from "@/components/CampaignCreation/layout/form/three/StepThree";
import StepFour from "@/components/CampaignCreation/layout/form/four/StepFour";
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