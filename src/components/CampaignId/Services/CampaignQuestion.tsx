import { CampaignFaqsApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignFaqsEntity } from '@/lib/SmartDB/Entities';
import type { FAQ } from '@/types/types';

export const createCampaignFaqs = async (faqs: FAQ[], campaignId: string | undefined) => {
    try {
        const createdFaqs = [];
        for (const faq of faqs) {
            const campaignFaqEntity = new CampaignFaqsEntity(faq);
            if (campaignId !== undefined) {
                campaignFaqEntity.campaign_id = campaignId;
            }
            const createdFaq = await CampaignFaqsApi.createApi(campaignFaqEntity);
            createdFaqs.push(createdFaq);
        }
        return createdFaqs;
    } catch (error) {
        console.error('Error creating campaign FAQs:', error);
        throw error;
    }
};

export const removeCampaignFaq = async (faqId: string) => {
    try {
        await CampaignFaqsApi.deleteByIdApi(CampaignFaqsEntity, faqId);
    } catch (error) {
        console.error('Error removing campaign FAQ:', error);
        throw error;
    }
}