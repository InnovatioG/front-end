import StepFour from '@/components/CampaignCreation/Layout/Form/Four/StepFour';
import StepThree from '@/components/CampaignCreation/Layout/Form/Three/StepThree';
import StepTwo from '@/components/CampaignCreation/Layout/Form/Two/StepTwo';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import StepOne from '@/components/CampaignCreation/Layout/Form/StepOne'

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
