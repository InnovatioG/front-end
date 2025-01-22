import { CampaignContentApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignContentEntity } from '@/lib/SmartDB/Entities';
import { CampaignContent } from '@/types/types';

export const postCampaignContent = async (campaignContent: CampaignContent[], campaignID: string | undefined) => {
    try {
        const createdContenet = [];

        for (const content of campaignContent) {
            console.log(content)
            const campaignCreatedContent = new CampaignContentEntity(content);
            if (campaignID !== undefined) {
                campaignCreatedContent.campaign_id = campaignID;
            }
            const createdContent = await CampaignContentApi.createApi(campaignCreatedContent);
            createdContenet.push(createdContent);
        }
        return createdContenet;
    } catch (error) {
        console.error('Error creating campaign content:', error);
        throw error;
    }
};



export const updateCampaignContent = async (campaignContents: CampaignContent[]) => {
    try {
        const updatedContents = [];
        for (const content of campaignContents) {
            console.log(content)

            const updatedContent = await CampaignContentApi.updateWithParamsApi_(content._DB_id!, content);
            console.log(updatedContent)
            updatedContents.push(updatedContent);
        }
        return updatedContents;
    } catch (error) {
        console.error('Error updating campaign content:', error);
        throw error;
    }
};

export const deleteCampaignContentInformation = async (contentId: string) => {
    try {
        await CampaignContentApi.deleteByIdApi(CampaignContentEntity, contentId);

    } catch (error) {
        console.error("Error deleting campaign content:", error);
        throw error;
    }
};


