import React from 'react';
import styles from "./Tokenomics.module.scss"
import TextEditor from '@/components/general/textEditor/TextEditor';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
interface TokenomicsProps {
    // Define props here
}

const Tokenomics: React.FC<TokenomicsProps> = (props) => {

    const { project, setProject } = useProjectDetailStore();

    console.log(project);






    return (
        <div>
            <h2 className={styles.title}>Explain your tokenomics, quantity and value</h2>
            <div className={styles.formContainer}>
                <div className={styles.inputContainer}>
                    <label htmlFor="">Token Tick Name</label>
                    <input type="text" placeholder='$ADA' />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="">Quantity and value per token.</label>
                    <input type="text" placeholder='Quantity' />
                    <input type="text" placeholder='$ADA' />
                </div>

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