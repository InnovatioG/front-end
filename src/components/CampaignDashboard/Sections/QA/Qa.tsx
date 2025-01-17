import AddMore from '@/components/UI/Buttons/AddMore/AddMore';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import FramerMotionAnimation from '@/utils/framerMotion';
import React from 'react';
import styles from "@/components/CampaignDashboard/Sections/QA/Qa.module.scss"
import useQA from '@/components/CampaignDashboard/Sections/QA/useQA'
interface QYAProps {
    // Define props here
}

const QYA: React.FC<QYAProps> = () => {
    const { faqs, viewInputQuestion, isOpen, newQa, handleNewQa, handleQuestionOpen, handleChange, handleRemoveQa, setIsOpen } = useQA();

    return (
        <div className={styles.generalContainer}>
            {faqs.map((faq, index) => (
                <div key={index} className={styles.questionContainer}>
                    <div>
                        <h4 className={styles.questionTitle}>{faq.question}</h4>
                    </div>
                    <div className={styles.container}>
                        <p className={styles.questionAnswer}>{faq.answer}</p>
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
                    <input type="text" name="question" value={newQa.question} onChange={handleChange} className={styles.input} placeholder="Insert question" />
                    <textarea name="answer" value={newQa.answer} onChange={handleChange} className={styles.inputText} placeholder="Describe answer" />
                    <div className={styles.saveButtonContainer}>
                        <GeneralButtonUI onClick={handleNewQa} text="Save" classNameStyle="green" />
                    </div>
                </div>
            </FramerMotionAnimation>
        </div>
    );
};

export default QYA;
