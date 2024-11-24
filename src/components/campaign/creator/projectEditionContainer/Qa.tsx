import React, { useState } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./Qa.module.scss";
import GeneralButtonUI from '@/components/buttons/UI/Button';
import FramerMotionAnimation from '@/utils/framerMotion';
import AddMore from '@/components/buttons/addMore/AddMore';
interface QYAProps {
    // Define props here
}

const QYA: React.FC<QYAProps> = (props) => {
    const { project, setProject } = useProjectDetailStore();
    const faqs = project.faqs || []; // Ensure faqs is always an array
    const [viewInputQuestion, setViewInputQuestion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [newQa, setNewQa] = useState({ name: "", description: "", order: 0 });

    const handleNewQa = () => {
        setProject({
            ...project,
            faqs: [...faqs, newQa]
        });
        setNewQa({ name: "", description: "", order: faqs.length + 1 });
    }

    const handleQuestionOpen = () => {
        setIsOpen(!isOpen);
        setViewInputQuestion(!viewInputQuestion);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQa(prevState => ({ ...prevState, [name]: value }));
    }

    const handleRemoveQa = (index: number) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        setProject({
            ...project,
            faqs: newFaqs
        });
    }

    return (
        <div className={styles.generalContainer}>
            {faqs.map((faq, index) => (
                <div key={index} className={styles.questionContainer}>
                    <div>
                        <h4 className={styles.questionTitle}>{faq.name}</h4>
                    </div>
                    <div className={styles.container}>
                        <p className={styles.questionAnswer}>{faq.description}</p>
                        <button onClick={() => handleRemoveQa(index)} className={styles.deleteButton}>
                            <img src="/img/icons/delete.svg" alt="deleteIcon" />
                        </button>
                    </div>
                    <div className={styles.divisor}></div>
                </div>
            ))}

            <div className={styles.buttonGeneral}>
                <AddMore isOpen={isOpen} setIsOpen={setIsOpen} handleAddMore={handleQuestionOpen} />
            </div>

            <FramerMotionAnimation isVisible={viewInputQuestion}>
                <div className={styles.textContainer}>
                    <input type="text" name="name" value={newQa.name} onChange={handleChange} className={styles.input} placeholder='Insert question' />
                    <textarea name="description" value={newQa.description} onChange={handleChange} className={styles.inputText} placeholder='Describe answer' />
                    <div className={styles.saveButtonContainer}>
                        <GeneralButtonUI onClick={handleNewQa} text="Save" classNameStyle='green' />
                    </div>
                </div>
            </FramerMotionAnimation>
        </div>
    );
}

export default QYA;