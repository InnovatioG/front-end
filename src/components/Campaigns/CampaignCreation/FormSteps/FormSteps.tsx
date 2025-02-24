import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import FormStep01 from './FormStep01/FormStep01';
import FormStep02 from './FormStep02/FormStep02';
import FormStep03 from './FormStep03/FormStep03';
import FormStep04 from './FormStep04/FormStep04';

interface FormStepsProps {
    step: number;
    setStep: (step: number) => void;
    editingMember: number | undefined;
    setEditingMember: (editingMember: number | undefined) => void;
    handleCreateCampaign: () => Promise<void>;
}

const FormSteps: React.FC<FormStepsProps & ICampaignIdStoreSafe> = (props: FormStepsProps & ICampaignIdStoreSafe) => {
    const { campaignTab, campaign, step, handleCreateCampaign } = props;

    const stepComponents: { [key: number]: React.ReactNode } = {
        1: <FormStep01 {...props} />,
        2: <FormStep02 {...props} />,
        3: <FormStep03 {...props} />,
        4: <FormStep04 {...props} handleCreateCampaign={handleCreateCampaign}/>,
    };

    const stepComponent: React.ReactNode = stepComponents[step];

    if (stepComponent === undefined) {
        return null;
    }

    return stepComponent;
};

export default FormSteps;
