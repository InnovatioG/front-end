import styles from '@/components/General/GeneralButtonContainer/generalbuttonContainer.module.scss';
import GeneralButtonUI from '@/components/General/Buttons/UI/Button';
import React from 'react';

interface GeneralButtonContainerProps {
    // Define props here
}

const GeneralButtonContainer: React.FC<GeneralButtonContainerProps> = (props) => {
    return (
        <div className={styles.container}>
            <GeneralButtonUI text="Contact support team" onClick={() => console.log('Save')} classNameStyle="outline" />
            <GeneralButtonUI text="Save Draft" onClick={() => console.log('Cancel')} />
        </div>
    );
};

export default GeneralButtonContainer;
