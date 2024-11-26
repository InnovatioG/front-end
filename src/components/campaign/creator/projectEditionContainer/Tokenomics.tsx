import React from 'react';
import styles from "./Tokenomics.module.scss";
import TextEditor from '@/components/general/textEditor/TextEditor';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { inputFieldsToken } from '@/utils/constants';

const Tokenomics: React.FC = () => {
    const { project, setProject } = useProjectDetailStore();

    const handleInputChange = (id: string, value: string, transform: (value: string) => any) => {
        setProject({
            ...project,
            [id]: transform(value)
        });
    };

    const fields = inputFieldsToken(project);

    console.log(project.cdRequestedMaxADA);

    const valuePerToken = project.cdRequestedMaxADA === null || isNaN(project.cdRequestedMaxADA) || project.goal === null || isNaN(project.goal) || project.goal === 0
        ? "Price per token"
        : project.goal / project.cdRequestedMaxADA;

    return (
        <div className={styles.layout}>
            <h2 className={styles.title}>Explain your tokenomics, quantity and value</h2>
            <div className={styles.formContainer}>
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className={`${styles.singleInputContainer} ${index === 0 ? styles.fullWidth : ''}`}
                    >
                        <label className={styles.label}>{field.label}</label>
                        <input
                            className={styles.input}
                            type={field.type}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={(e) => handleInputChange(field.id, e.target.value, field.transform)}
                        />



                    </div>
                ))}
            </div>
            <div className={styles.inputTokenContainer}>
                <label className={styles.inputToken}>
                    {valuePerToken}
                </label>
            </div>

            <br />

            <div className={styles.textEditorContianer}>
                <TextEditor
                    styleOption='quillEditorB'
                    content={""}
                    onChange={() => { setProject }}
                />
            </div>
        </div>
    );
}

export default Tokenomics;