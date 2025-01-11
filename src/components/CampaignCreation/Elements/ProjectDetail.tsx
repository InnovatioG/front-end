import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import ModalTemplate from '@/components/UI/Modal/ModalTemplate';
import { useCampaignId } from '@/hooks/useProjectDetail';
import React, { useState } from 'react';
import styles from './ProjectDetail.module.scss';
interface ProjectDetailProps {
    // Define props here
}

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
    const {
        textEditorOptions,
        selectedOption,
        content,
        newOptionTitle,
        checkboxState,
        setSelectedOption,
        setNewOptionTitle,
        handleEditorChange,
        handleAddOption,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleCheckboxChange,
        contentReorder,
        draggedIndex,
    } = useCampaignId();

    const [openModal, setIsOpenModal] = useState(false);

    return (
        <article className={styles.generalLayout}>
            <div className={styles.layoutProject}>
                {/* NAVEGACION  */}

                <div className={styles.optionsContainer}>
                    {textEditorOptions.map((option, index) => {
                        const hasContent = content[option.id] && content[option.id] !== '<p><br></p>';
                        const isActive = selectedOption.id === option.id;
                        return (
                            <div
                                key={option.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver(index)}
                                onDragEnd={handleDragEnd}
                                className={`${styles.draggableItem} ${draggedIndex === index ? styles.dragging : ''}`}
                            >
                                <GeneralButtonUI
                                    key={option.id}
                                    onClick={() => setSelectedOption(option)}
                                    classNameStyle={`${isActive ? 'menu-index' : 'menu-index-selected'} ${hasContent ? 'non-empty-content' : ''}`}
                                    className={`${isActive ? styles.activeButton : ''} ${hasContent ? styles.hasContentButton : ''}`}
                                >
                                    <Checkbox variant={true} checked={!!content[option.id]} onChange={() => handleCheckboxChange(option.id)} hasContent={hasContent} />
                                    <span className={hasContent ? styles.buttonWhite : styles.buttonSpan}>{option.title}</span>
                                    <ToolTipInformation content={option.tooltip} />
                                </GeneralButtonUI>
                            </div>
                        );
                    })}
                    <GeneralButtonUI
                        text="Add index"
                        onClick={() => {
                            setIsOpenModal(true);
                        }}
                        classNameStyle="menu-index-selected"
                    />
                </div>

                {/* EDITOR DE TEXTOS */}
                <TextEditor title={selectedOption.title} content={content[selectedOption.id] || ''} onChange={handleEditorChange} styleOption="quillEditor" />
                <div className={styles.addOptionContainer}></div>
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text="Save" onClick={() => console.log('Save')} classNameStyle="green" />
            </div>

            {/* !! MODAL PARA AGREGAR UN NUEVO INDEX  */}

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

            {/*  */}
        </article>
    );
};

export default ProjectDetail;
