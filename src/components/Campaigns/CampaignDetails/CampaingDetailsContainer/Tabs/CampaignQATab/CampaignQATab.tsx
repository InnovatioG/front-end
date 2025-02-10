import styles from "./CampaignQATab.module.scss"
import { ICampaignDetails } from "@/hooks/useCampaingDetails";
import React from 'react';
import EmptyState from "../EmpyState/EmptyState";
import { ICampaignIdStoreSafe } from "@/store/campaignId/useCampaignIdStoreSafe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/General/Accordion/Accordion";

const CampaignQATab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign } = props;

    const { faqs } = campaign


    if (faqs === undefined) {
        return <EmptyState {...props}/>;
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

export default CampaignQATab;
