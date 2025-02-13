import styles from './CampaignFaqsTab.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import React from 'react';
import EmptyState from '@/components/Campaigns/CampaignDetails/CampaingContents/Tabs/EmpyState/EmptyState';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/General/Accordion/Accordion';
import useCampaignFaqsTab from './useCampaignFaqsTab';
import AddMore from '@/components/General/Buttons/AddMore/AddMore';
import FramerMotionAnimation from '@/utils/framerMotion';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import Image from 'next/image';
import { PageViewEnums } from '@/utils/constants/routes';

const CampaignFaqsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { faqs, isOpen, newQa, handleNewQa, handleQuestionOpen, handleChange, handleRemoveQa, setIsOpen } = useCampaignFaqsTab(props);

    if ((faqs === undefined || faqs.length === 0) && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    if (props.pageView === PageViewEnums.MANAGE && props.isEditMode === true) {
        return (
            <div className={styles.generalContainer}>
                {faqs?.map((faq, index) => (
                    <div key={index} className={styles.questionContainer}>
                        <div>
                            <h4 className={styles.questionTitle}>{faq.question}</h4>
                        </div>
                        <div className={styles.container}>
                            <p className={styles.questionAnswer}>{faq.answer}</p>
                            <button onClick={() => handleRemoveQa(index)} className={styles.deleteButton}>
                                <Image src="/img/icons/delete.svg" alt="deleteIcon" width={30} height={30} />
                            </button>
                        </div>
                        <div className={styles.divisor}></div>
                    </div>
                ))}

                <div className={styles.buttonGeneral}>
                    <AddMore isOpen={isOpen} setIsOpen={setIsOpen} handleAddMore={handleQuestionOpen} />
                </div>

                <FramerMotionAnimation isVisible={isOpen}>
                    <div className={styles.textContainer}>
                        <input type="text" name="question" value={newQa.question} onChange={handleChange} className={styles.input} placeholder="Insert question" />
                        <textarea name="answer" value={newQa.answer} onChange={handleChange} className={styles.inputText} placeholder="Describe answer" />
                        <div className={styles.saveButtonContainer}>
                            <BtnGeneral onClick={handleNewQa} text="Save" classNameStyle="green" />
                        </div>
                    </div>
                </FramerMotionAnimation>
            </div>
        );
    }

    return (
        <div className={styles.generalContainer}>
            <Accordion type="single" collapsible style={{ background: 'trasparent' }}>
                {faqs?.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} style={{ background: 'transparent' }}>
                        <AccordionTrigger open={true} toggleOpen={() => {}} style={{ background: 'transparent' }}>
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

export default CampaignFaqsTab;
