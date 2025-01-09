import React from 'react';
import GeneralButtonUI from '../UI/Button';
import styles from './AddMore.module.scss';

interface AddMoreProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddMore: () => void;
}

const AddMore: React.FC<AddMoreProps> = ({ isOpen, setIsOpen, handleAddMore }) => {
    return (
        <div>
            <GeneralButtonUI onClick={handleAddMore} classNameStyle="menu-index">
                <div className={styles.buttonContainer}>
                    <div className={`${styles.plus} ${isOpen ? styles.open : ''}`}>{isOpen ? '×' : '+'}</div>
                    <span>{isOpen ? 'Add More' : 'Add More'}</span>
                </div>
            </GeneralButtonUI>
        </div>
    );
};

export default AddMore;
