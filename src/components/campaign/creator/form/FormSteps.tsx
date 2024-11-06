import StepOne from "./one/StepOne";
import StepTwo from "@/components/campaign/creator/form/two/StepTwo";
import StepThree from "@/components/campaign/creator/form/three/StepThree";
import StepFour from "@/components/campaign/creator/form/four/StepFour";
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