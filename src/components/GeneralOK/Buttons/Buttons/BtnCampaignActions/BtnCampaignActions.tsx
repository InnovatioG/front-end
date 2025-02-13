import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { ButtonType } from '@/utils/constants/buttons';
import { HandlesEnums } from '@/utils/constants/constants';
import { useRouter } from 'next/router';
import React from 'react';

interface BtnCampaignActionsProps {
    button: ButtonType;
    data?: Record<string, any>;
    handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<void>>>;
}

export const BtnCampaignActions: React.FC<BtnCampaignActionsProps> = ({ button, data, handles }) => {
    const { openModal } = useModal();
    const router = useRouter();
    return (
        <BtnGeneral
            text={`${button.label}`}
            onClick={() => {
                button.action(data, router.push, openModal, handles);
            }}
            classNameStyle={button.classNameType}
        ></BtnGeneral>
    );
};
