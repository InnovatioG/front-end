import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';

export interface CampaignMembersTabAccordionProps {
    onEditMember?: (member: CampaignMemberEntity) => void;
}
const useCampaignMembersTabAccordion = (props: CampaignMembersTabAccordionProps & ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, isEditMode, onEditMember } = props;
    // const { setSelectedMember, setStep } = useCampaignStore();
    const { members } = campaign;


    const handleClickEditButton = (member: CampaignMemberEntity) => {
        console.log(member);
        if (onEditMember) {
            onEditMember(member);
        }
    };
    return {
        handleClickEditButton,
        isEditMode,
        campaign,
        members,
    };
};

export default useCampaignMembersTabAccordion;
