import AddMore from '@/components/UI/Buttons/AddMore/AddMore';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import FramerMotionAnimation from '@/utils/framerMotion';
import React, { useState } from 'react';
import styles from './Qa.module.scss';
interface QYAProps {
    // Define props here
}

const QYA: React.FC<QYAProps> = (props) => {
    const { project, setProject } = useCampaignIdStore();
    const faqs = project.faqs || []; // Ensure faqs is always an array
    const [viewInputQuestion, setViewInputQuestion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [newQa, setNewQa] = useState({ name: '', description: '', order: 0 });

    const handleNewQa = () => {
        setProject({
            ...project,
            faqs: [...faqs, newQa],
        });
        setNewQa({ name: '', description: '', order: faqs.length + 1 });
    };

    const handleQuestionOpen = () => {
        setIsOpen(!isOpen);
        setViewInputQuestion(!viewInputQuestion);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQa((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRemoveQa = (index: number) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        setProject({
            ...project,
            faqs: newFaqs,
        });
    };

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
                    <input type="text" name="name" value={newQa.name} onChange={handleChange} className={styles.input} placeholder="Insert question" />
                    <textarea name="description" value={newQa.description} onChange={handleChange} className={styles.inputText} placeholder="Describe answer" />
                    <div className={styles.saveButtonContainer}>
                        <GeneralButtonUI onClick={handleNewQa} text="Save" classNameStyle="green" />
                    </div>
                </div>
            </FramerMotionAnimation>
        </div>
    );
};

export default QYA;
