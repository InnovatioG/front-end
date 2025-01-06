import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/Accordion"
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "@/components/campaign/creator/projectEditionContainer/Qa.module.scss"
import EmptyState from '../emptyStates/EmptyState';

interface QAProps {
    // Define props here
}

const QA: React.FC<QAProps> = (props) => {

    const { project } = useProjectDetailStore();

    const faqs = project.faqs || [];

    if (faqs.length === 0) {
        return <EmptyState />;
    }


    return (
        <div className={styles.generalContainer}>
            <Accordion type='single' collapsible style={{ background: "trasparent" }} >
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} style={{ background: "transparent" }}>
                        <AccordionTrigger open={true} toggleOpen={() => { }} style={{ background: "transparent" }}>
                            <h4 className={styles.questionTitle}>{faq.name}</h4>
                        </AccordionTrigger>
                        <AccordionContent open={true} style={{ background: "transparent", padding: "0.3rem 1rem" }}>
                            <p className={styles.questionAnswer}>{faq.description}</p>
                        </AccordionContent>
                        <div className={styles.borderLine}></div>
                    </AccordionItem>
                ))}
            </Accordion>

        </div>
    );
}

export default QA;