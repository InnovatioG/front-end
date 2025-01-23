import React, { useState, useEffect, useRef } from 'react';
import { MembersTeam } from '@/types/types';
import { createCampaignMembers, updateMember } from '@/components/CampaignId/Services/CampaignMember';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useModal } from '@/contexts/ModalContext';
import { ca } from 'date-fns/locale';

const useResumeOfTheTeam = () => {
    const [addNewMember, setAddNewMember] = useState(false);
    const [newMember, setNewMember] = useState<MembersTeam>({
        id: '',
        _DB_id: '',
        campaign_id: '',
        name: '',
        last_name: '',
        email: '',
        role: '',
        member_description: '',
        member_picture: '',
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        linkedin: '',
        twitter: '',
        admin: false,
        member_manage_funds: false,
        wallet_id: '',
        wallet_address: '',
        editor: false,
    });
    console.log('newMember', newMember);

    const { campaign } = useCampaignIdStore();
    const { _DB_id } = campaign;
    const { openModal } = useModal();

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (addNewMember && formRef.current) {
            // Utilizamos setTimeout para asegurar que el scroll ocurre después del render
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }, [addNewMember]);

    const handleEditMember = (member: typeof newMember) => {
        console.log(member)
        setNewMember(member);
        setAddNewMember(true);
        // No necesitamos shouldScroll; el efecto anterior se encargará del scroll
    };

    const handleAddMore = () => {
        const willOpen = !addNewMember;
        setAddNewMember(willOpen);
        if (!willOpen) {
            setNewMember({
                id: '',
                campaign_id: '',
                name: '',
                last_name: '',
                email: '',
                role: '',
                member_description: '',
                member_picture: '',
                website: '',
                facebook: '',
                instagram: '',
                discord: '',
                linkedin: '',
                twitter: '',
                admin: false,
                member_manage_funds: false,
                wallet_id: '',
                wallet_address: '',
                editor: false,
            });
        }
    };

    const handleMemberCretion = async (newMember: MembersTeam) => {
        try {
            await createCampaignMembers(newMember, campaign._DB_id);
            openModal('successAction');
        } catch (error) {
            console.log(error);
        }
    };

    const handleMemberUpdate = async (newMember: MembersTeam) => {
        try {
            await updateMember(newMember);
            openModal('successAction');
        } catch (error) {
            console.log(error);
        }
    };

    const handleSaveMember = () => {
        if (newMember.id) {
            handleMemberUpdate(newMember);
        } else {
            handleMemberCretion(newMember);
        }
    };

    const setNewMemberField = (key: keyof typeof newMember, value: any) => {
        setNewMember((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return {
        addNewMember,
        newMember,
        formRef,
        handleEditMember,
        handleAddMore,
        setNewMemberField,
        handleMemberUpdate,
        setNewMember,
        setAddNewMember,
        handleMemberCretion,
        handleSaveMember,
    };
};

export default useResumeOfTheTeam;