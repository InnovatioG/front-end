import React, { useState } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion/Accordion';
import styles from "./Qa.module.scss"
import GeneralButtonUI from '@/components/buttons/UI/Button';
import FramerMotionAnimation from '@/utils/framerMotion';

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
                <Accordion key={index} type="single" collapsible className={styles.faqContainer}>
                    <AccordionItem value={`item-${index}`}  >
                        <AccordionTrigger open={true} toggleOpen={() => { }} style={{ background: "transparent", padding: "0.5rem" }}>
                            <div>
                                <h4 className={styles.questionTitle}>{faq.name}</h4>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent open={true} style={{ background: "transparent", padding: "0.5rem" }} >
                            <div className={styles.container}>
                                <p className={styles.questionAnswer}>{faq.description}</p>
                                <button onClick={() => handleRemoveQa(index)} className={styles.deleteButton}>
                                    <img src="/img/icons/delete.svg" alt="deleteIcon" />
                                </button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <div className={styles.divisor}></div>
                </Accordion>
            ))}

            <div>
                <GeneralButtonUI onClick={handleQuestionOpen} classNameStyle='menu-index'>
                    <div className={styles.buttonContainer}>
                        <div className={`${styles.plus} ${isOpen ? styles.open : ''}`}>{isOpen ? '+' : '+'}</div>
                        <span>
                            {isOpen ? 'Add More' : 'Add More'}
                        </span>
                    </div>
                </GeneralButtonUI>
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