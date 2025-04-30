import React from 'react';
import styles from './AddMore.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';

interface AddMoreProps {
    isOpen: boolean;
    handleAddMore: () => void;
}

const AddMore: React.FC<AddMoreProps> = ({ isOpen, handleAddMore }) => {
    return (
        <div>
            <BtnGeneral onClick={handleAddMore} classNameStyle="menu-index">
                <div className={styles.buttonContainer}>
                    <div className={`${styles.plus} ${isOpen ? styles.open : ''}`}>{isOpen ? '×' : '+'}</div>
                    <span>{isOpen ? 'Add More' : 'Add More'}</span>
                </div>
            </BtnGeneral>
        </div>
    );
};

export default AddMore;
