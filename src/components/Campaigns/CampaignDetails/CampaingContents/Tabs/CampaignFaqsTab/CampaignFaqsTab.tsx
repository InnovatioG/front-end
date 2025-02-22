import styles from './CampaignFaqsTab.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import React from 'react';
import EmptyState from '@/components/Campaigns/CampaignDetails/CampaingContents/Tabs/EmpyState/EmptyState';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/GeneralOK/Controls/Accordion/Accordion';
import useCampaignFaqsTab from './useCampaignFaqsTab';
import AddMore from '@/components/General/Buttons/AddMore/AddMore';
import FramerMotionAnimation from '@/utils/framerMotion';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import Image from 'next/image';
import { PageViewEnums } from '@/utils/constants/routes';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const CampaignFaqsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { faqs, isOpenAddMore, newQa, handleNewQa, handleQuestionOpen, handleChange, handleRemoveQa, setIsOpenAddMore, handleUpdateOrder } = useCampaignFaqsTab(props);

    if ((faqs === undefined || faqs.length === 0) && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    if (props.pageView === PageViewEnums.MANAGE && props.isEditMode === true) {
        return (
            <div className={styles.generalContainer}>
                <DragDropContext onDragEnd={handleUpdateOrder}>
                    <Droppable droppableId="faqs-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {faqs?.map((faq, index) => (
                                    <Draggable key={faq.order} draggableId={faq.order.toString()} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={styles.questionContainer}>
                                                <div className={styles.containerDetails}>
                                                    <h4 className={styles.questionTitle}>{`${faq.order}. ${faq.question}`}</h4>
                                                    <p className={styles.questionAnswer}>{faq.answer}</p>
                                                    <div className={styles.divisor}></div>
                                                </div>
                                                <div className={styles.containerBtns}>
                                                    {/* Only the button is the drag handle */}
                                                    <div className={styles.dragButton} {...provided.dragHandleProps}>
                                                        ⠿
                                                    </div>
                                                    <button onClick={() => handleRemoveQa(index)} className={styles.deleteButton}>
                                                        <Image src="/img/icons/delete.svg" alt="deleteIcon" width={18} height={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <div className={styles.buttonGeneral}>
                    <AddMore isOpen={isOpenAddMore} handleAddMore={handleQuestionOpen} />
                </div>

                <FramerMotionAnimation isVisible={isOpenAddMore}>
                    <div className={styles.textContainer}>
                        <input type="text" name="question" value={newQa.question} onChange={handleChange} className={styles.input} placeholder="Insert question" />
                        <textarea name="answer" value={newQa.answer} onChange={handleChange} className={styles.inputText} placeholder="Describe answer" />
                        <div className={styles.saveButtonContainer}>
                            <BtnGeneral onClick={handleNewQa} text="Add" classNameStyle="green" />
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
                        <AccordionTrigger  style={{ background: 'transparent' }}>
                            <h4 className={styles.questionTitle}>{faq.question}</h4>
                        </AccordionTrigger>
                        <AccordionContent style={{ background: 'transparent', padding: '0.3rem 1rem' }}>
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
