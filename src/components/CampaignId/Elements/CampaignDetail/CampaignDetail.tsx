import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import ModalTemplate from '@/components/UI/Modal/ModalTemplate';
import { useCampaignId } from '@/hooks/useCampaignDetail';
import React, { useState, useEffect } from 'react';
import styles from '@/components/CampaignId/Elements/CampaignDetail/CampaignDetail.module.scss';
import { useCampaignDetail } from '@/components/CampaignId/Elements/CampaignDetail/useCampaignDetail';

const CampaignDetail: React.FC = (props) => {
    const [openModal, setIsOpenModal] = useState(false);
    const {
        loading,
        mergedOptions,
        handleSelectClick,
        selectedOption,
        handleAddOption,
        newOptionTitle,
        setNewOptionTitle,
        setSelectedOption,
        handleDescriptionChange,
        setViewOptions,
        defaultOptions,
        viewOptions,
        handleAddOptionMenu,
        handleSaveContent,
        handleDeleteButton
    } = useCampaignDetail();

    useEffect(() => {
        setSelectedOption(mergedOptions[0]);
    }, []);

    return (
        <article className={styles.generalLayout}>
            <div className={styles.layoutProject}>
                <div className={styles.optionsContainer}>
                    {mergedOptions &&
                        mergedOptions.map((option, index) => (
                            <div key={option.order}>
                                <GeneralButtonUI classNameStyle="has" onClick={() => handleSelectClick(index)} className={styles.hasContentButton}>
                                    {option.name}
                                </GeneralButtonUI>
                            </div>
                        ))}
                    <GeneralButtonUI
                        text="Add index"
                        onClick={() => {
                            setViewOptions(!viewOptions);
                        }}
                        classNameStyle="menu-index-selected"
                    />
                    {viewOptions && (
                        <div className={styles.otherOptions}>
                            {defaultOptions.map((option, index) => (
                                <div key={option.name}>
                                    <GeneralButtonUI
                                        classNameStyle="buttonMenu"
                                        onClick={() => handleAddOptionMenu(option)}
                                        text={`${option.name}`}
                                        className={styles.buttonMenu}
                                    />
                                </div>
                            ))}
                            <GeneralButtonUI classNameStyle="buttonMenu" onClick={() => setIsOpenModal(true)} text="+ Add free index" className={styles.buttonMenu} />
                        </div>
                    )}

                </div>


                <div>
                    {selectedOption ? (
                        <div>
                            <TextEditor
                                title={selectedOption.name || 'Untitled'}
                                content={selectedOption.description || ''}
                                styleOption="quillEditor"
                                onChange={(newContent) => {
                                    handleDescriptionChange(newContent); // Pasa el nuevo contenido al callback
                                }}
                            />
                            <div className={styles.saveButtonContainer}>


                                <GeneralButtonUI onClick={() => { selectedOption._DB_id && handleDeleteButton(selectedOption._DB_id) }} classNameStyle="outlineb">
                                    <span>Delete</span>
                                </GeneralButtonUI>

                                <GeneralButtonUI onClick={handleSaveContent} classNameStyle="green">
                                    <span className={styles.saveButton}>
                                        Save
                                    </span>
                                </GeneralButtonUI>
                            </div>

                        </div>

                    ) : (
                        <p>Please select an option to edit</p>
                    )}
                </div>
            </div>
            <ModalTemplate isOpen={openModal} setIsOpen={setIsOpenModal}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Add Index</h2>
                    <div className={styles.inputContainer}>
                        <input type="text" value={newOptionTitle} onChange={(e) => setNewOptionTitle(e.target.value)} placeholder="New section title" className={styles.input} />
                        <GeneralButtonUI
                            text="Confirm"
                            onClick={() => {
                                handleAddOption();
                                setIsOpenModal(false);
                            }}
                        />
                    </div>
                </div>
            </ModalTemplate>
        </article>
    );
};

export default CampaignDetail;
/* 
   
import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import ModalTemplate from '@/components/UI/Modal/ModalTemplate';
import { useCampaignId } from '@/hooks/useProjectDetail';
import React, { useState, useEffect } from 'react';
import styles from '@/components/CampaignId/Elements/CampaignDetail/CampaignDetail.module.scss';
import { useCampaignDetail } from '@/components/CampaignId/Elements/CampaignDetail/useCampaignDetail';

const CampaignDetail: React.FC = (props) => {
    const [openModal, setIsOpenModal] = useState(false);
    const {
        loading,
        mergedOptions,
        handleSelectClick,
        selectedOption,
        handleAddOption,
        newOptionTitle,
        setNewOptionTitle,
        setSelectedOption,
        handleDescriptionChange,
        setViewOptions,
        defaultOptions,
        viewOptions,
        handleAddOptionMenu,
    } = useCampaignDetail();

    useEffect(() => {
        if (mergedOptions.length > 0) {
            setSelectedOption({ ...mergedOptions[0] }); // Selecciona la primera opción por defecto
        }
    }, [mergedOptions]);

    return (
        <article className={styles.generalLayout}>
            <div className={styles.layoutProject}>
                <div className={styles.optionsContainer}>
                    {mergedOptions &&
                        mergedOptions.map((option, index) => (
                            <div key={option.order}>
                                <GeneralButtonUI classNameStyle="has" onClick={() => handleSelectClick(index)} className={styles.hasContentButton}>
                                    {option.name}
                                </GeneralButtonUI>
                            </div>
                        ))}
                    <GeneralButtonUI
                        text="Add index"
                        onClick={() => {
                            setViewOptions(!viewOptions);
                        }}
                        classNameStyle="menu-index-selected"
                    />
                    {viewOptions && (
                        <div className={styles.otherOptions}>
                            {defaultOptions.map((option, index) => (
                                <div key={option.name}>
                                    <GeneralButtonUI
                                        classNameStyle="buttonMenu"
                                        onClick={() => handleAddOptionMenu(option)}
                                        text={`${option.name}`}
                                        className={styles.buttonMenu}
                                    />
                                </div>
                            ))}
                            <GeneralButtonUI classNameStyle="buttonMenu" onClick={() => setIsOpenModal(true)} text="+ Add free index" className={styles.buttonMenu} />
                        </div>
                    )}
                </div>

                <div>
                    {selectedOption ? (
                        <div>
                            <TextEditor
                                title={selectedOption?.name || 'Untitled'}
                                content={selectedOption?.description || ''}
                                styleOption="quillEditor"
                                onChange={(newContent) => {
                                    handleDescriptionChange(newContent); // Actualiza en tiempo real
                                }}
                            />
                            <div className={styles.saveButtonContainer}>
                                <GeneralButtonUI onClick={() => { }} classNameStyle="green">
                                    <span className={styles.saveButton}>
                                        Save
                                    </span>
                                </GeneralButtonUI>
                            </div>
                        </div>
                    ) : (
                        <p>Please select an option to edit</p>
                    )}
                </div>
            </div>

            <ModalTemplate isOpen={openModal} setIsOpen={setIsOpenModal}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Add Index</h2>
                    <div className={styles.inputContainer}>
                        <input type="text" value={newOptionTitle} onChange={(e) => setNewOptionTitle(e.target.value)} placeholder="New section title" className={styles.input} />
                        <GeneralButtonUI
                            text="Confirm"
                            onClick={() => {
                                handleAddOption();
                                setIsOpenModal(false);
                            }}
                        />
                    </div>
                </div>
            </ModalTemplate>
        </article>
    );
};

export default CampaignDetail;
 */
