import React from 'react';
import styles from './BtnCampaignActions.module.scss';
import { ButtonType } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { HandleEnums, ModalEnums } from '@/utils/constants/constants';

interface BtnCampaignActionsProps {
    button: ButtonType;
    data?: Record<string, any>;
    navigate?: (url: string) => void;
    openModal?: (modal: ModalEnums, data?: Record<string, any>) => void,
    handles?: Partial<Record<HandleEnums, (data?: Record<string, any>) => Promise<void>>>;
}

export const BtnCampaignActions: React.FC<BtnCampaignActionsProps> = ({ button, data, navigate, openModal, handles }) => {
    return (
        <BtnGeneral
            text={`${button.label} >`}
            onClick={() => {
                button.action(data, navigate, openModal, handles);
            }}
            classNameStyle={button.classNameType}
        ></BtnGeneral>
    );
};
