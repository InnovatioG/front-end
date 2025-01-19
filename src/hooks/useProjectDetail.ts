import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { initialTextEditorOptions } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { CampaignEntity, MilestoneEntity, CampaignMemberEntity, CampaignContentEntity, CampaignFaqsEntity, MilestoneSubmissionEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, MilestoneApi, CampaignMemberApi, CampaignContentApi, CampaignFaqsApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import type { Campaign, Milestone, MembersTeam, CampaignContent, FAQ, MilestoneSubmission } from '@/types/types';
import { parse } from 'path';

export const useCampaignId = () => {
    const { campaign, setCampaign, setIsLoading } = useCampaignIdStore();

    const transformToBaseCampaign = async (campaign: CampaignEntity): Promise<Campaign> => {
        const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id }); /* .sort(
            (a, b) => parseInt(a._DB_id) - parseInt(b._DB_id)
        );
 */
        const milestoneIds = milestonesEntities.map((milestone) => milestone._DB_id);
        const membersTeamEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const campaignContentEntities: CampaignContentEntity[] = await CampaignContentApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const campaignFaqsEntities: CampaignFaqsEntity[] = await CampaignFaqsApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const milestoneSubmissionEntities: MilestoneSubmissionEntity[] = (
            await Promise.all(milestoneIds.map((id) => MilestoneSubmissionApi.getByParamsApi_({ milestone_id: id })))
        ).flat() as MilestoneSubmissionEntity[];
        const milestone_submissions: MilestoneSubmission[] = milestoneSubmissionEntities.map((milestoneSubmission) => ({
            _DB_id: milestoneSubmission._DB_id,
            milestone_id: milestoneSubmission.milestone_id,
            submission_status_id: milestoneSubmission.submission_status_id,
            report_proof_of_finalization: milestoneSubmission.report_proof_of_finalization,
            approved_justification: milestoneSubmission.approved_justification,
            rejected_justification: milestoneSubmission.rejected_justification,
        }));

        const members_team: MembersTeam[] = membersTeamEntities.map((member) => ({
            id: member._DB_id,
            campaign_id: member.campaign_id,
            name: member.name,
            last_name: member.last_name,
            role: member.role,
            admin: member.admin,
            email: member.email,
            wallet_id: member.wallet_id,
            wallet_address: member.wallet_address,
            website: member.website,
            instagram: member.instagram,
            facebook: member.facebook,
            discord: member.discord,
            twitter: member.twitter,
        }));

        const milestones: Milestone[] = milestonesEntities.map((milestone) => ({
            _DB_id: milestone._DB_id,
            campaign_id: milestone.campaign_id,
            milestone_status_id: milestone.milestone_status_id,
            estimate_delivery_days: milestone.estimate_delivery_days,
            estimate_delivery_date: milestone.estimate_delivery_date,
            milestone_submissions: milestone_submissions.filter((submission) => submission.milestone_id === milestone._DB_id),
            percentage: milestone.percentage,
            description: milestone.description,
            createdAt: milestone.createdAt.toISOString(),
            updatedAt: milestone.updatedAt?.toISOString() || '',
        }));

        const campaignContent: CampaignContent[] = campaignContentEntities.map((content) => ({
            campaign_id: content.campaign_id,
            name: content.name,
            description: content.description,
            order: content.order,
        }));

        const faqs: FAQ[] = campaignFaqsEntities.map((faq) => ({
            _DB_id: faq._DB_id,
            campaign_id: faq.campaign_id,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
        }));

        // Retornar el objeto transformado
        return {
            _DB_id: campaign._DB_id,
            creator_wallet_id: campaign.creator_wallet_id,
            name: campaign.name,
            description: campaign.description,
            campaign_status_id: campaign.campaign_status_id,
            banner_url: campaign.banner_url,
            logo_url: campaign.logo_url,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            investors: campaign.investors,
            requestMaxAda: campaign.requestedMaxADA,
            campaing_category_id: campaign.campaing_category_id,
            requestMinAda: campaign.requestedMinADA,
            website: campaign.website,
            facebook: campaign.facebook,
            instagram: campaign.instagram,
            campaignToken_CS: campaign.campaignToken_CS,
            campaignToken_tn: campaign.campaignToken_TN,
            campaignToken_priceADA: campaign.campaignToken_PriceADA,
            mint_campaignToken: campaign.mint_CampaignToken,
            tokenomics_max_supply: campaign.tokenomics_max_supply,
            discord: campaign.discord,
            twitter: campaign.twitter,
            milestones,
            members_team,
            faqs: faqs,
            campaign_content: campaignContent,
            begin_at: campaign.begin_at,
            deadline: campaign.deadline,
            cdFundedADA: campaign.cdFundedADA,
            tokenomics_description: campaign.tokenomics_description,
        };
    };

    const fetchCampaigns = async (id: string[]) => {
        setIsLoading(true);
        try {
            const data: CampaignEntity | undefined = await CampaignApi.getByIdApi_(String(id));
            if (!data) {
                throw new Error('Campaign not found');
            }
            if (data) {
                setCampaign(await transformToBaseCampaign(data));
            } else {
                throw new Error('Campaign not found');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            pushWarningNotification('Error', `Error fetching Campaigns: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };
    /* 
    const campaignContent = campaign?.campaign_content || [];

    console.log('campaignContent', campaignContent);

    const campaignContentMap = campaignContent.reduce((acc: { [key: string]: any }, content) => {
        acc[content.campaign_id] = content;
        return acc;
    }, {});

    const initialContent = initialTextEditorOptions.reduce((acc: { [key: number]: string }, option) => {
        const existingContent = campaignContentMap[option.id.toString()];
        acc[option.id] = existingContent?.description ?? '';
        return acc;
    }, {});

    console.log(initialContent);
    console.log(initialContent);

    const initialContentReorder = initialTextEditorOptions.reduce(
        (
            acc: {
                [key: number]: {
                    campaign_id: string;
                    name: string;
                    description: string;
                    order: number;
                };
            },
            option,
            index
        ) => {
            const existingContent = campaignContentMap[option.id.toString()];
            acc[option.id] = {
                campaign_id: option.id.toString(),
                name: existingContent?.name ?? option.title, // Usar el título de campaignContent si está disponible
                description: existingContent?.description ?? '',
                order: existingContent?.order ?? index,
            };
            return acc;
        },
        {}
    );
    const [textEditorOptions, setTextEditorOptions] = useState(
        initialTextEditorOptions.map((option, index) => {
            console.log('option', option); // Ahora está dentro de la función de mapeo
            return {
                ...option,
                order: index * 10, // Añadimos el campo order
            };
        })
    );
    console.log(textEditorOptions);

    const [selectedOption, setSelectedOption] = useState(initialTextEditorOptions[0]);
    console.log('initial content', initialContent);

    const [content, setContent] = useState<{ [key: number]: string }>(initialContent);
    const [contentReorder, setContentReorder] = useState<{
        [key: number]: {
            campaign_id?: string;
            name?: string;
            description?: string;
            order?: number;
        };
    }>(initialContentReorder);

    const [newOptionTitle, setNewOptionTitle] = useState('');
    const [checkboxState, setCheckboxState] = useState<{
        [key: number]: boolean;
    }>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const newContentReorder: {
            [key: number]: {
                id: number;
                title: string;
                content: string;
                order: number;
            };
        } = {};
        textEditorOptions.forEach((option) => {
            newContentReorder[option.id] = {
                id: option.id,
                title: option.title,
                content: content[option.id] || '',
                order: option.order,
            };
        });
        setContentReorder(newContentReorder);
    }, [content, textEditorOptions]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => (event: React.DragEvent) => {
        event.preventDefault();
        if (index === draggedIndex) return;

        const options = [...textEditorOptions];
        if (draggedIndex === null) return;
        const item = options[draggedIndex];
        options.splice(draggedIndex, 1);
        options.splice(index, 0, item);
        setTextEditorOptions(options);

        const updatedContent: { [key: number]: string } = {};
        options.forEach((option) => {
            updatedContent[option.id] = content[option.id] || '';
        });
        setContent(updatedContent);

        setDraggedIndex(index);
    };

    const handleCheckboxChange = (optionId: number) => {
        setCheckboxState((prevState) => ({
            ...prevState,
            [optionId]: !prevState[optionId],
        }));
    };

    const handleEditorChange = (newContent: string) => {
        setContent((prevContent) => ({
            ...prevContent,
            [selectedOption.id]: newContent,
        }));
    };

    const handleAddOption = () => {
        if (newOptionTitle.trim() === '') return;

        const newOption = {
            id: textEditorOptions.length > 0 ? Math.max(...textEditorOptions.map((option) => option.id)) + 1 : 1,
            title: newOptionTitle,
            order: textEditorOptions.length * 10,
            tooltip: '', // Add a default tooltip value
        };

        setTextEditorOptions([...textEditorOptions, newOption]);
        setSelectedOption(newOption);
        setNewOptionTitle('');
    };

    const handleDragEnd = () => {
        const newContentReorder: {
            [key: number]: {
                id: number;
                title: string;
                content: string;
                order: number;
            };
        } = {};
        textEditorOptions.forEach((option, index) => {
            newContentReorder[option.id] = {
                id: option.id,
                title: option.title,
                content: content[option.id] || '',
                order: index * 10,
            };
        });
        setContentReorder(newContentReorder);
        setDraggedIndex(null);
    }; */

    return {
        fetchCampaigns,
        /*     textEditorOptions,
        selectedOption,
        content,
        newOptionTitle,
        checkboxState,
        setSelectedOption,
        setNewOptionTitle,
        handleEditorChange,
        handleAddOption,
        handleCheckboxChange,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        contentReorder,
        draggedIndex, */
    };
};

/* const transformToBaseCampaign = async (campaign: CampaignEntity): Promise<Campaign> => {
        const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const membersTeamEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const campaignContentEntities: CampaignContentEntity[] = await CampaignContentApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const campaignFaqsEntities: CampaignFaqsEntity[] = await CampaignFaqsApi.getByParamsApi_({ campaign_id: campaign._DB_id });
        const milestoneSubmissionEntities: MilestoneSubmissionEntity[] = await MilestoneSubmissionApi.getByParamsApi_({ milestone_id: campaign.miles });

        const milestone_submissions: MilestoneSubmission[] = milestoneSubmissionEntities.map((milestoneSubmission) => ({
            _DB_id: milestoneSubmission._DB_id,
            milestone_id: milestoneSubmission.milestone_id,
            submission_status_id: milestoneSubmission.submission_status_id,
            report_proof_of_finalization: milestoneSubmission.report_proof_of_finalization,
            approved_justification: milestoneSubmission.approved_justification,
            rejected_justification: milestoneSubmission.rejected_justification,
        }));

        const members_team: MembersTeam[] = membersTeamEntities.map((member) => ({
            id: member._DB_id,
            campaign_id: member.campaign_id,
            name: member.name,
            last_name: member.last_name,
            role: member.role,
            admin: member.admin,
            email: member.email,
            wallet_id: member.wallet_id,
            wallet_address: member.wallet_address,
            website: member.website,
            instagram: member.instagram,
            facebook: member.facebook,
            discord: member.discord,
            twitter: member.twitter,
        }));

        const milestones: Milestone[] = milestonesEntities.map((milestone) => ({
            _DB_id: milestone._DB_id,
            campaign_id: milestone.campaign_id,
            milestone_status_id: milestone.milestone_status_id,
            estimate_delivery_days: milestone.estimate_delivery_days,
            estimate_delivery_date: milestone.estimate_delivery_date,
            milestone_submissions: milestone.milestone_submissions,
            percentage: milestone.percentage,
            description: milestone.description,
            createdAt: milestone.createdAt.toISOString(),
            updatedAt: milestone.updatedAt?.toISOString() || '',
        }));

        const campaignContent: CampaignContent[] = campaignContentEntities.map((content) => ({
            campaign_id: content.campaign_id,
            name: content.name,
            description: content.description,
            order: content.order,
        }));

        const faqs: FAQ[] = campaignFaqsEntities.map((faq) => ({
            campaign_id: faq.campaign_id,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
        }));

        return {
            _DB_id: campaign._DB_id,
            creator_wallet_id: campaign.creator_wallet_id,
            name: campaign.name,
            description: campaign.description,
            campaign_status_id: campaign.campaign_status_id,
            banner_url: campaign.banner_url,
            logo_url: campaign.logo_url,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            investors: campaign.investors,
            requestMaxAda: campaign.requestedMaxADA,
            campaing_category_id: campaign.campaing_category_id,
            requestMinAda: campaign.requestedMinADA,
            website: campaign.website,
            facebook: campaign.facebook,
            instagram: campaign.instagram,
            campaignToken_CS: campaign.campaignToken_CS,
            campaignToken_tn: campaign.campaignToken_TN,
            campaignToken_priceADA: campaign.campaignToken_PriceADA,
            mint_campaignToken: campaign.mint_CampaignToken,
            tokenomics_max_supply: campaign.tokenomics_max_supply,
            discord: campaign.discord,
            twitter: campaign.twitter,
            milestones,
            members_team,
            faqs: faqs,

            campaign_content: campaignContent,
            begin_at: campaign.begin_at,
            deadline: campaign.deadline,
            cdFundedADA: campaign.cdFundedADA,
            tokenomics_description: campaign.tokenomics_description,
        };
    };

    const fetchCampaigns = async (id: string[]) => {
        setIsLoading(true);
        try {
            const data: CampaignEntity = await CampaignApi.getByIdApi_(String(id));
            if (data) {
                setCampaign(await transformToBaseCampaign(data));
            } else {
                throw new Error('Campaign not found');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            pushWarningNotification('Error', `Error fetching Campaigns: ${error}`);
        } finally {
            setIsLoading(false);
        }
        setIsLoading(false);
    }; */
