import { MembersTeam } from '@/types/types';
import { useRouter } from 'next/router';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';

const useResumeOfTheTeamAccordion = (onEditMember?: (member: MembersTeam) => void) => {
    const { campaign, editionMode } = useCampaignIdStore();
    const { setSelectedMember, setStep } = useCampaignStore();
    const router = useRouter();
    const { members_team } = campaign;

    const socialMedia = {
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        discord: 'Discord',
        linkedin: 'Linkedin',
        xs: 'XS',
    };

    const handleClickEditButton = (member: MembersTeam) => {
        if (onEditMember) {
            onEditMember(member);
        }
    };
    return {
        members_team,
        socialMedia,
        handleClickEditButton,
        setSelectedMember,
        setStep,
        router,
        editionMode,
        campaign,
    };
};

export default useResumeOfTheTeamAccordion;
