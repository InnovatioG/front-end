import React from 'react';
import styles from "./Tokenomics.module.scss"
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



    return (
        <div>
            <h2 className={styles.title}>Explain your tokenomics, quantity and value</h2>
            <div className={styles.formContainer}>
                {fields.map((field) => (
                    <div key={field.id} className={styles.inputContainer}>
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={(e) => handleInputChange(field.id, e.target.value, field.transform)}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.textEditorContianer}>
                <TextEditor
                    styleOption='quillEditorB'
                    content={""}
                    onChange={() => { }}
                />
            </div>
        </div>
    );
}

export default Tokenomics;