import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CHEVRON_RIGHT } from '@/utils/constants/images';
import React, { useEffect, useState } from 'react';
import styles from './CampaignsCreation.module.scss';
import FormHeader from './FormHeader/FormHeader';
import FormSteps from './FormSteps/FormSteps';
import StepController from './StepController/StepController';
import { CampaignEX } from '@/types/types';
import { toJson } from 'smart-db';
import { useModal } from '@/contexts/ModalContext';
import { ModalsEnums } from '@/utils/constants/constants';
import { serviceSaveCampaign } from '@/utils/campaignServices';
import { Router, useRouter } from 'next/router';
import { ROUTES } from '@/utils/constants/routes';

export interface CampaignsCreationProps {}

const CampaignsCreation: React.FC<CampaignsCreationProps> = (props) => {
    const propsCampaignIdStoreSafe = useCampaignIdStoreSafe();
    const { openModal } = useModal();
    const router = useRouter();

    const { showDebug } = useGeneralStore();

    const [step, setStep] = useState(1);
    const [editingMember, setEditingMember] = useState<number | undefined>(undefined);

    useEffect(() => {
        propsCampaignIdStoreSafe.setIsLoading(false);
        propsCampaignIdStoreSafe.setIsValidEdit(false);
    }, []);

    const titleForCampaignCreation = (step: number): string => {
        if (step !== 4) {
            return "Let's start with the initial description";
        } else {
            return 'Present your team members :)';
        }
    };

    const handleClickBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleCreateCampaign = async () => {
        const onFinish = async (campaign: CampaignEX, data?: Record<string, any>) => {
            console.log('onFinish', campaign, toJson(data));
            openModal(ModalsEnums.SUCCESS, data);
        };
        const handleSaveCampaign = (data?: Record<string, any>) => serviceSaveCampaign(propsCampaignIdStoreSafe.campaign, data, onFinish);
        if (confirm('Are you sure you want to crete the campaign?')) {
            propsCampaignIdStoreSafe.setIsLoading(true);
            try {
                const id = await handleSaveCampaign();
                if (id !== undefined) {
                    router.push(`${ROUTES.campaignManage(id)}`, undefined, { scroll: false });
                }
            } finally {
                propsCampaignIdStoreSafe.setIsLoading(false);
            }
        }
    };

    return (
        <main className={styles.generalContainer}>
            <section className={styles.layout}>
                <FormHeader {...propsCampaignIdStoreSafe} />
                <div className={styles.stepController}>
                    <h2 className={styles.titleSection}>{titleForCampaignCreation(step) || ''}</h2>
                    <StepController {...propsCampaignIdStoreSafe} step={step} setStep={setStep} editingMember={editingMember} setEditingMember={setEditingMember} />
                </div>

                <div className={styles.stepContent}>
                    <div className={styles.backContainer}>
                        {step > 1 && (
                            <svg width="18" height="18" className={styles.icon} onClick={handleClickBack}>
                                <use href={CHEVRON_RIGHT}></use>
                            </svg>
                        )}
                    </div>
                    <FormSteps
                        {...propsCampaignIdStoreSafe}
                        step={step}
                        setStep={setStep}
                        editingMember={editingMember}
                        setEditingMember={setEditingMember}
                        handleCreateCampaign={handleCreateCampaign}
                    />
                </div>
            </section>
        </main>
    );
};

export default CampaignsCreation;
