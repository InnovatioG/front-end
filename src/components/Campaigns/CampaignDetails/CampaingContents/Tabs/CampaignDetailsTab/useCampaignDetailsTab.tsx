import { useModal } from '@/contexts/ModalContext';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignContentEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ModalsEnums } from '@/utils/constants/constants';
import { PageViewEnums } from '@/utils/constants/routes';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';

interface CampaignContent {
    name: string;
    description: string;
}

const useCampaignDetailsTab = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaignEX } = props;
    const contents = useMemo(() => [...(campaign.contents ?? [])].sort((a, b) => a.order - b.order), [campaign]);

    const [activeViewContent, setActiveViewContent] = useState<string | undefined>(contents.length > 0 ? contents[0]._DB_id : undefined);
    const contentsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeContentRef = useRef<string | undefined>(activeViewContent); // ✅ Fix stale state issue

    const [viewTitleOptions, setViewTitleOptions] = useState(false);
    const [selectedContent, setSelectedContent] = useState<CampaignContentEntity | undefined>(contents.length > 0 ? contents[0] : undefined);
    const { openModal, closeModal } = useModal();

    const initialTextEditorOptions: Partial<CampaignContent>[] = [
        {
            name: "What's the product?",
            description:
                "In this section, you should provide a clear and concise description of your product, service, or project. Answer questions like what it is, what it does, If it's a physical product, describe its key features and how it benefits the user. If it's a service, explain what it entails and how it satisfies a need or solves a specific problem.",
        },
        {
            name: "What's your value?",
            description:
                "In this section, highlight the unique and valuable aspects of your digital product, service, or project. Explore how it stands out from other available options in the market and why it's a superior choice. This may include distinctive features, additional benefits, competitive advantages, or core values that support your proposal.",
        },
        {
            name: 'How it works?',

            description:
                "In this section, explain how your product, service, or project operates in practice. Detail the steps or processes involved, from acquisition to use or implementation. If it's a product, describe how it's used and what benefits it offers to users. If it's a service, explain how it's delivered and how customers can access it. If it's a project, describe how it will be carried out and what stages or milestones it will involve.",
        },
        {
            name: 'Marketing Strategy',
            description:
                "In this section, describe your general strategy to promote and market your digital product, service, or project. Explore the marketing channels you will utilize, such as social media, email marketing, digital advertising, etc. Detail your specific tactics, like content creation, participation in events, collaboration with influencers, etc. It's also helpful to explain how you will measure and evaluate the success of your marketing efforts.",
        },
    ];

    const defaultTitleOptions = initialTextEditorOptions.filter((option) => !contents.some((item) => item.name === option.name));

    useEffect(() => {
        if (contents.length === 0) return;

        // ✅ Set first section as active on mount
        setActiveViewContent(contents[0]._DB_id);
        activeContentRef.current = contents[0]._DB_id;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let newActiveSection: string | undefined = undefined;

            contentsRefs.current.forEach((section, index) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    newActiveSection = contents[index]._DB_id;
                }
            });

            // ✅ Handle reaching the bottom of the page
            const bottomThreshold = document.documentElement.scrollHeight - window.innerHeight - 10;
            if (window.scrollY >= bottomThreshold) {
                newActiveSection = contents[contents.length - 1]._DB_id;
            }

            // ✅ Update state only if it's different from the current active section
            if (newActiveSection !== undefined && newActiveSection !== activeContentRef.current) {
                activeContentRef.current = newActiveSection;
                setActiveViewContent(newActiveSection);
            }
        };

        if (props.pageView === PageViewEnums.MANAGE && props.isEditMode === true) return;

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run on mount

        return () => window.removeEventListener('scroll', handleScroll);
    }, [contents]);

    const handleClickViewContent = (id: string) => {
        const index = contents.findIndex((content) => content._DB_id === id);
        const section = contentsRefs.current[index];

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveViewContent(id);
            activeContentRef.current = id; // ✅ Keep reference updated
        }
    };

    const handleNewTitle = (modal: ReactNode) => {
        openModal(ModalsEnums.EDIT_CONTENTS, undefined, undefined, modal);
    };

    const handleAddContent = (option: Partial<CampaignContent>) => {
        const newContent = new CampaignContentEntity(option);
        newContent.campaign_id = campaign.campaign._DB_id;
        let order = 1;
        const reorderedContents = [...contents, newContent].map((content) => {
            content.order = order++;
            return content;
        });
        setCampaignEX({
            ...campaign,
            contents: reorderedContents,
        });
        setViewTitleOptions(false);
        setSelectedContent(newContent);
    };

    const handleClickEditContent = (content: CampaignContentEntity | undefined) => {
        setSelectedContent(content);
    };

    const handleUpdateContent = (description: string) => {
        if (selectedContent === undefined) return;
        const updatedContent = new CampaignContentEntity({ ...selectedContent, description: description });
        setCampaignEX({
            ...campaign,
            contents: [...contents.filter((content) => content.order !== selectedContent.order), updatedContent],
        });
        setSelectedContent(updatedContent);
    };

    const handleRemoveContent = (content: CampaignContentEntity) => {
        const confirm = window.confirm('Are you sure you want to delete this section?');
        if (!confirm) return;
        const deletedItems = content._DB_id === undefined ? [...(campaign.contents_deleted || [])] : [...(campaign.contents_deleted || []), content];
        const newContents = contents.filter((c) => c.order !== content.order);
        let order = 1;
        const reorderedContents = newContents.map((content) => {
            content.order = order++;
            return content;
        });
        setCampaignEX({
            ...campaign,
            contents: reorderedContents,
            contents_deleted: deletedItems,
        });
    };

    const handleUpdateOrder = (result: DropResult) => {
        if (!result.destination) return;
        const oldSelectedContentOrder = selectedContent?.order;
        const updatedContents = Array.from(contents);
        const [movedItem] = updatedContents.splice(result.source.index, 1);
        updatedContents.splice(result.destination.index, 0, movedItem);
        let order = 1;
        const reorderedContents = updatedContents.map((content) => {
            content.order = order++;
            if (content.order === oldSelectedContentOrder) {
                setSelectedContent(content);
            }
            return content;
        });
        setCampaignEX({
            ...campaign,
            contents: reorderedContents,
        });
    };

    return {
        campaign,
        contents,
        activeViewContent,
        contentsRefs,
        closeModal,
        handleClickViewContent,
        handleClickEditContent,
        handleNewTitle,
        viewTitleOptions,
        setViewTitleOptions,
        defaultTitleOptions,
        handleAddContent,
        selectedContent,
        setSelectedContent,
        handleUpdateContent,
        handleRemoveContent,
        handleUpdateOrder,
    };
};

export default useCampaignDetailsTab;
