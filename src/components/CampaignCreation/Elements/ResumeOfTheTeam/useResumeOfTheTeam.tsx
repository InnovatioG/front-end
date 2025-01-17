import React, { useState, useEffect, useRef } from "react"
import { MembersTeam } from "@/types/types";
import { createCampaignMembers } from "@/components/CampaignId/Services/CampaignMember";
import { useCampaignIdStore } from "@/store/campaignId/useCampaignIdStore";

const useResumeOfTheTeam = () => {
    const [addNewMember, setAddNewMember] = useState(false);
    const [newMember, setNewMember] = useState<MembersTeam>({
        id: '',
        campaign_id: "",
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
    console.log(newMember)


    const { campaign } = useCampaignIdStore()
    const { _DB_id } = campaign

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
        setNewMember(member);
        setAddNewMember(true);
        // No necesitamos shouldScroll; el efecto anterior se encargará del scroll
    };

    const handleAddMore = () => {
        const willOpen = !addNewMember;
        setAddNewMember(willOpen);
        if (willOpen) {
            // El efecto se encargará del scroll
        }
    };

    const handleMemberCretion = async (newMember: MembersTeam) => {
        await createCampaignMembers(newMember, _DB_id);
    }

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
        setNewMember,
        setAddNewMember,
        handleMemberCretion
    }
}


export default useResumeOfTheTeam