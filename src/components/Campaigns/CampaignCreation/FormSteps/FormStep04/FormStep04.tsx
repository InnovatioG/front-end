import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { isBlobURL } from '@/utils/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { isNullOrBlank, useWalletStore } from 'smart-db';
import styles from './FormStep04.module.scss';
import FormCreateOrEditMember from '@/components/Campaigns/CampaignDetails/CampaingContents/Tabs/CampaignMembersTab/FormCreateOrEditMember/FormCreateOrEditMember';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';

interface FormStep04Props {
    step: number;
    setStep: (step: number) => void;
    editingMember: number | undefined;
    setEditingMember: (editingMember: number | undefined) => void;
    handleCreateCampaign: () => Promise<void>;
}
const FormStep04: React.FC<FormStep04Props & ICampaignIdStoreSafe> = (props: FormStep04Props & ICampaignIdStoreSafe) => {
    const { campaign, setCampaignEX, setCampaign, step, setStep, isValidEdit, setIsValidEdit, editingMember, setEditingMember, handleCreateCampaign } = props;
    const members = useMemo(() => [...(campaign.members ?? [])].sort((a, b) => a.order - b.order), [campaign]);
    const walletStore = useWalletStore();
    const { wallet } = useGeneralStore();
    const [isChanged, setIsChanged] = useState(false);

    const defaultInitMember = new CampaignMemberEntity({
        campaign_id: campaign.campaign._DB_id,
        name: '',
        last_name: '',
        role: '',
        description: '',
        avatar_url: '',
        editor: true,
        admin: false,
        email: '',
        wallet_id: '',
        wallet_address: '',
        website: '',
        instagram: '',
        twitter: '',
        discord: '',
        linkedin: '',
        facebook: '',
        order: '',
    });

    const [initialNewMember, setInitialNewMember] = useState<CampaignMemberEntity>(defaultInitMember);

    useEffect(() => {
        if (walletStore.isConnected && walletStore.info?.address && wallet !== undefined) {
            if ((members?.length ?? 0) === 0) {
                setInitialNewMember(
                    new CampaignMemberEntity({
                        ...defaultInitMember,
                        wallet_id: wallet._DB_id,
                        wallet_address: walletStore.info?.address,
                        name: wallet.name,
                        email: wallet.email,
                        admin: true,
                    })
                );
            } else {
                setInitialNewMember(defaultInitMember);
            }
        }
    }, [walletStore.isConnected, walletStore.info?.address, members, wallet, setCampaignEX]);

    useEffect(() => {
        let isValidEdit = false;
        if ((members?.length ?? 0) > 0 && isChanged === false) {
            isValidEdit = true;
        }
        setIsValidEdit(isValidEdit);
    }, [campaign, isChanged, members]);

    const handleShowAddMember = () => {
        setEditingMember(undefined);
    };

    const handleCancelAddMember = () => {
        setEditingMember(members[0].order);
        setIsChanged(false);
    };

    const handleCancelEditMember = () => {
        setCampaignEX({
            ...campaign,
        });
        setIsChanged(false);
    };

    const handleAddMember = (member: CampaignMemberEntity) => {
        const newMember = new CampaignMemberEntity(member);
        newMember.campaign_id = campaign.campaign._DB_id;
        let order = 1;
        let editingMember = undefined;
        const reorderedMembers = [...members, newMember].map((member) => {
            member.order = order++;
            editingMember = member.order;
            return member;
        });
        setCampaignEX({
            ...campaign,
            members: reorderedMembers,
        });
        setEditingMember(editingMember);
        setIsChanged(false);
    };

    const handleUpdateMember = (updatedMember: CampaignMemberEntity) => {
        const prevMember = members.find((member) => member.order === updatedMember.order);
        if (!prevMember) return;
        // Me aseguro de que si el member tenia imagen cargada en s3, la voy a eliminar
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])];
        if (!isNullOrBlank(prevMember.avatar_url) && !isBlobURL(prevMember.avatar_url)) {
            files_to_delete.push(prevMember.avatar_url!);
        }
        setCampaignEX({
            ...campaign,
            members: [...members.filter((member) => member.order !== updatedMember.order), updatedMember],
            files_to_delete,
        });
        setIsChanged(false);
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
        setEditingMember(reorderedMembers.length > 0 ? reorderedMembers[0].order : undefined);
        setIsChanged(false);
    };

    return (
        <section className={styles.containerLayout}>
            {editingMember !== undefined ? <h2>Edit Member</h2> : <h2>Add Member</h2>}
            {editingMember !== undefined ? (
                <FormCreateOrEditMember
                    member={members.find((member) => member.order === editingMember)}
                    handleSaveMember={(updatedMember) => {
                        handleUpdateMember(updatedMember);
                    }}
                    handleCancel={() => handleCancelEditMember()}
                    showCancelGoBack={false}
                    showCancelEdit={true}
                    isNewMember={false}
                    onChanges={(isChanged) => setIsChanged(isChanged)}
                    showDelete={true}
                    handleRemove={(member) => handleRemoveMember(member)}
                />
            ) : (
                <FormCreateOrEditMember
                    handleSaveMember={(newMember) => {
                        handleAddMember(newMember);
                    }}
                    handleCancel={() => handleCancelAddMember()}
                    showCancelGoBack={members.length > 0}
                    showCancelEdit={false}
                    isNewMember={true}
                    member={initialNewMember}
                    onChanges={(isChanged) => setIsChanged(isChanged)}
                    showDelete={false}
                />
            )}
            <div className={styles.buttonContainer}>
                {editingMember !== undefined && isChanged === false && (
                    <BtnGeneral onClick={handleShowAddMember} classNameStyle="fillb">
                        Add Member
                    </BtnGeneral>
                )}
                <BtnGeneral onClick={handleCreateCampaign} classNameStyle="fillb" disabled={!isValidEdit}>
                    Create Project
                </BtnGeneral>
            </div>
        </section>
    );
};

export default FormStep04;
