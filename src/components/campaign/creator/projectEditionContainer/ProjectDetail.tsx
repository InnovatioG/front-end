import React, { useState } from 'react';
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
        handleCheckboxChange,
    } = useProjectDetail();

    console.log(content)

    return (
        <article className={styles.generalLayout}>
            <div className={styles.layoutProject}>
                <div className={styles.optionsContainer}>
                    {textEditorOptions.map(option => (
                        <GeneralButtonUI
                            key={option.id}
/*                             text={option.title}
 */                            onClick={() => setSelectedOption(option)}
                            classNameStyle={selectedOption.id === option.id ? 'menu-index' : 'menu-index-selected'}
                        >
                            <Checkbox variant={true} checked={!!content[option.id]}
                                onChange={() => handleCheckboxChange(option.id)} />

                            <span className={styles.textButton}>{option.title}</span>


                            <ToolTipInformation content={option.content} />
                        </GeneralButtonUI>


                    ))}
                    <GeneralButtonUI text="Add index" onClick={handleAddOption} classNameStyle='green' />
                </div>
                <TextEditor
                    title={selectedOption.title}
                    content={content[selectedOption.id] || ''}
                    onChange={handleEditorChange}
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