import { CampaignContentApi } from "@/lib/SmartDB/FrontEnd";
import { CampaignContentEntity } from "@/lib/SmartDB/Entities";
import { CampaignContent } from "@/types/types"



export const updateCampaignContentInformation = async (campaignContent: CampaignContent[], campaignID: string | undefined) => {
    try {
        const createdContenet = [];
        for (const content of campaignContent) {
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
}