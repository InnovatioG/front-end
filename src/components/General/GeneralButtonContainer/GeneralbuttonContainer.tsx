import styles from '@/components/General/BtnGeneralContainer/generalbuttonContainer.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import React from 'react';

interface BtnGeneralContainerProps {
    // Define props here
}

const BtnGeneralContainer: React.FC<BtnGeneralContainerProps> = (props) => {
    return (
        <div className={styles.container}>
            <BtnGeneral text="Contact support team" onClick={() => console.log('Save')} classNameStyle="outline" />
            <BtnGeneral text="Save Draft" onClick={() => console.log('Cancel')} />
        </div>
    );
};

export default BtnGeneralContainer;
