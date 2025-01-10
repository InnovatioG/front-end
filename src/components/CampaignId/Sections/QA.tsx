import styles from '@/components/CampaignCreation/Elements/Qa.module.scss';
import EmptyState from '@/components/CampaignId/Sections/EmptyState';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/UI/Accordion/Accordion';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';

interface QAProps {
    // Define props here
}

const QA: React.FC<QAProps> = (props) => {
    const { campaign } = useCampaignIdStore();

    const { faqs } = campaign


    if (faqs === undefined) {
        return <EmptyState />;
    }

    return (
        <div className={styles.generalContainer}>
            <Accordion type="single" collapsible style={{ background: 'trasparent' }}>
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} style={{ background: 'transparent' }}>
                        <AccordionTrigger open={true} toggleOpen={() => { }} style={{ background: 'transparent' }}>
                            <h4 className={styles.questionTitle}>{faq.question}</h4>
                        </AccordionTrigger>
                        <AccordionContent open={true} style={{ background: 'transparent', padding: '0.3rem 1rem' }}>
                            <p className={styles.questionAnswer}>{faq.answer}</p>
                        </AccordionContent>
                        <div className={styles.borderLine}></div>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default QA;
