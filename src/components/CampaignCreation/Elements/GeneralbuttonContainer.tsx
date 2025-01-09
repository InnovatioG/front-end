import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useProjectDetailStore } from '@/store/projectdetail/useCampaignIdStore';
import React from 'react';
import styles from './generalbuttonContainer.module.scss';

interface GeneralButtonContainerProps {
    // Define props here
}

const GeneralButtonContainer: React.FC<GeneralButtonContainerProps> = (props) => {
    const { project, setProject } = useProjectDetailStore();
    return (
        <div className={styles.container}>
            <GeneralButtonUI text="Contact support team" onClick={() => console.log('Save')} classNameStyle="outline" />
            <GeneralButtonUI text="Save Draft" onClick={() => console.log('Cancel')} />
        </div>
    );
};

export default GeneralButtonContainer;
