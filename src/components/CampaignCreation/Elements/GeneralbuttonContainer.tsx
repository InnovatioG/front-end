import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';
import styles from './generalbuttonContainer.module.scss';

interface GeneralButtonContainerProps {
    // Define props here
}

const GeneralButtonContainer: React.FC<GeneralButtonContainerProps> = (props) => {
    const { project, setProject } = useCampaignIdStore();
    return (
        <div className={styles.container}>
            <GeneralButtonUI text="Contact support team" onClick={() => console.log('Save')} classNameStyle="outline" />
            <GeneralButtonUI text="Save Draft" onClick={() => console.log('Cancel')} />
        </div>
    );
};

export default GeneralButtonContainer;
