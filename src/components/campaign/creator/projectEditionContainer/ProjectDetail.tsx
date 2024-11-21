import React, { useState, useEffect } from 'react';
import TextEditor from '@/components/general/textEditor/TextEditor';
import styles from "./ProjectDetail.module.scss";
import GeneralButtonUI from '@/components/buttons/UI/Button';
import Checkbox from '@/components/buttons/checkbox/Checkbox';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import ToolTipInformation from '@/components/general/tooltipInformation/tooltipInformation';

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
        draggedIndex
    } = useProjectDetail();

    useEffect(() => {
        console.log('Reordered content:', contentReorder);
    }, [contentReorder]);

    return (
        <article className={styles.generalLayout}>
            <div className={styles.layoutProject}>
                <div className={styles.optionsContainer}>
                    {textEditorOptions.map((option, index) => {
                        const hasContent = content[option.id] && content[option.id] !== "<p><br></p>";
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
                                    <Checkbox variant={true} checked={!!content[option.id]}
                                        onChange={() => handleCheckboxChange(option.id)} hasContent={hasContent} />
                                    <span className={hasContent ? styles.buttonWhite : styles.buttonSpan}>
                                        {option.title}
                                    </span>
                                    <ToolTipInformation content={option.content} />
                                </GeneralButtonUI>
                            </div>
                        );
                    })}
                    <GeneralButtonUI text="Add index" onClick={handleAddOption} classNameStyle='menu-index-selected' />
                </div>
                <TextEditor
                    title={selectedOption.title}
                    content={content[selectedOption.id] || ''}
                    onChange={handleEditorChange}
                    styleOption='quillEditor'

                />
                <div className={styles.addOptionContainer}>
                    <input
                        type="text"
                        value={newOptionTitle}
                        onChange={(e) => setNewOptionTitle(e.target.value)}
                        placeholder="New section title"
                        className={styles.input}
                    />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text="Save" onClick={() => console.log("Save")} classNameStyle='green' />
            </div>
        </article>
    );
}

export default ProjectDetail;


