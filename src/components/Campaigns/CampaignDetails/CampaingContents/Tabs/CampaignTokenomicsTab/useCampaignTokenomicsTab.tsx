import { AccordionHandle } from '@/components/GeneralOK/Controls/Accordion/Accordion';
import { useModal } from '@/contexts/ModalContext';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ModalsEnums } from '@/utils/constants/constants';
import { isBlobURL } from '@/utils/utils';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { isNullOrBlank } from 'smart-db';

const useCampaignTokenomicsTab = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaignEX } = props;
    const members = useMemo(() => [...(campaign.members ?? [])].sort((a, b) => a.order - b.order), [campaign]);

    const [isOpenAddMore, setIsOpenAddMore] = useState(false);
    const [editingMember, setEditingMember] = useState<number | undefined>(undefined);

    const accordionRef = useRef<AccordionHandle>(null);

    const handleOpenCreateMember = () => {
        setIsOpenAddMore(true);
        setEditingMember(undefined);
    };

    const handleOpenEditMember = (member: CampaignMemberEntity) => {
        setIsOpenAddMore(false);
        setEditingMember(member.order);
    };

    const handleCancelEditMember = () => {
        setIsOpenAddMore(false);
        setEditingMember(undefined);
    };

    const handleAddMember = (member: CampaignMemberEntity) => {
        const newMember = new CampaignMemberEntity(member);
        newMember.campaign_id = campaign.campaign._DB_id;
        let order = 1;
        const reorderedMembers = [...members, newMember].map((member) => {
            member.order = order++;
            return member;
        });
        setCampaignEX({
            ...campaign,
            members: reorderedMembers,
        });
        setIsOpenAddMore(false);
        setTimeout(() => {
            const newMemberValue = `${newMember.order}`;
            accordionRef.current?.setOpenItem(newMemberValue);
        }, 200);
    };

    const handleUpdateMember = (updatedMember: CampaignMemberEntity) => {

        const prevMember = members.find((member) => member.order === updatedMember.order);
        if (!prevMember) return;

        // Me aseguro de que si el member tenia imagen cargada en s3, la voy a eliminar
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])] 
        if (!isNullOrBlank(prevMember.avatar_url) && !isBlobURL(prevMember.avatar_url)) {
            files_to_delete.push(prevMember.avatar_url!);
        }

        setCampaignEX({
            ...campaign,
            members: [...members.filter((member) => member.order !== updatedMember.order), updatedMember],
            files_to_delete
        });
        
        setEditingMember(undefined);
        setTimeout(() => {
            const updatedMemberValue = `${updatedMember.order}`;
            accordionRef.current?.setOpenItem(updatedMemberValue);
        }, 200);
    };

    const handleRemoveMember = (member: CampaignMemberEntity) => {
        const confirm = window.confirm('Are you sure you want to delete this member?');
        if (!confirm) return;
        const deletedItems = member._DB_id === undefined ? [...(campaign.members_deleted || [])] : [...(campaign.members_deleted || []), member];
        const newMembers = members.filter((c) => c.order !== member.order);
        let order = 1;
        const reorderedMembers = newMembers.map((member) => {
            member.order = order++;
            return member;
        });
        setCampaignEX({
            ...campaign,
            members: reorderedMembers,
            members_deleted: deletedItems,
        });
    };

    const handleUpdateOrder = (result: DropResult) => {
        if (!result.destination) return;
        // Get currently open item
        const oldSelectedMemberOrder = accordionRef.current?.getOpenItem();
        console.log(`oldSelectedMemberOrder = ${oldSelectedMemberOrder}`);
        const updatedMembers = Array.from(members);
        const [movedItem] = updatedMembers.splice(result.source.index, 1);
        updatedMembers.splice(result.destination.index, 0, movedItem);
        let order = 1;
        const reorderedMembers = updatedMembers.map((member) => {
            if (member.order.toString() === oldSelectedMemberOrder) {
                const updatedMemberValue = `${order}`;
                setTimeout(() => {
                    accordionRef.current?.setOpenItem(updatedMemberValue, false);
                    console.log(`updatedMemberValue = ${updatedMemberValue}`);
                }, 0);
            }
            member.order = order++;
            return member;
        });
        setCampaignEX({
            ...campaign,
            members: reorderedMembers,
        });
    };

    return {
        accordionRef,
        campaign,
        members,
        editingMember,
        handleAddMember,
        handleUpdateMember,
        handleRemoveMember,
        handleUpdateOrder,
        isOpenAddMore,
        setIsOpenAddMore,
        handleOpenCreateMember,
        handleOpenEditMember,
        handleCancelEditMember,
        setCampaignEX,
    };
};

export default useCampaignTokenomicsTab;
