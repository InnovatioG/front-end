import { Accordion, AccordionContent, AccordionHandle, AccordionItem, AccordionTrigger } from '@/components/GeneralOK/Controls/Accordion/Accordion';
import AddMore from '@/components/General/Buttons/AddMore/AddMore';
import SocialButton from '@/components/General/Buttons/SocialIcon/SocialButton';
import { AvatarDisplay, AvatarFallback, AvatarImage } from '@/components/GeneralOK/Avatar/AvatarDisplay/AvatarDisplay';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { SocialLinksIcons } from '@/utils/constants/constants';
import { PageViewEnums } from '@/utils/constants/routes';
import { formatLink } from '@/utils/formats';
import React, { useRef } from 'react';
import EmptyState from '../EmpyState/EmptyState';
import styles from './CampaignMembersTab.module.scss';
import FormCreateOrEditMember from './FormCreateOrEditMember/FormCreateOrEditMember';
import useCampaignMembersTab from './useCampaignMembersTab';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CampaignMembersTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const {
        accordionRef,
        campaign,
        members,
        editingMember,
        handleAddMember,
        handleUpdateMember,
        handleRemoveMember,
        handleUpdateOrder,
        isOpenAddMore,
        setIsOpenAddMore,
        handleOpenCreateMember,
        handleOpenEditMember,
        handleCancelEditMember,
        setCampaignEX,
    } = useCampaignMembersTab(props);

    if ((members === undefined || members.length === 0) && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    const isEditing = props.pageView === PageViewEnums.MANAGE && props.isEditMode === true

    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <div>
                {editingMember === undefined && (
                    <DragDropContext onDragEnd={handleUpdateOrder}>
                        <Droppable droppableId="members-list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <Accordion ref={accordionRef} type="single" collapsible className={styles.accordionContainer}>
                                        {members &&
                                            members.map((member, index) => (
                                                <Draggable key={member.order} draggableId={member.order.toString()} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className={styles.questionContainer}>
                                                            <div className={styles.memeberContainer}>
                                                                {isEditing ? (
                                                                    <div className={styles.dragButton} {...provided.dragHandleProps}>
                                                                        ⠿
                                                                    </div>
                                                                ) : (
                                                                    <div className={styles.dragButton} {...provided.dragHandleProps} style={{ visibility: 'hidden' }} hidden>
                                                                        ⠿
                                                                    </div>
                                                                )}
                                                                <div className={styles.memeberDetails}>
                                                                    <AccordionItem key={index} value={`${member.order}`}>
                                                                        <AccordionTrigger>
                                                                            <div className={styles.faqContainer}>
                                                                                <AvatarDisplay big={true}>
                                                                                    <AvatarImage src={member.avatar_url || ''} alt={member.name} />
                                                                                    <AvatarFallback>{(member?.name || 'NA').slice(0, 2)}</AvatarFallback>
                                                                                </AvatarDisplay>
                                                                                <span>
                                                                                    {member.name} {member.last_name}
                                                                                </span>
                                                                            </div>
                                                                        </AccordionTrigger>
                                                                        <AccordionContent>
                                                                            <div className={styles.contentLayoutHeader}>
                                                                                <div className={styles.contentHeader}>
                                                                                    <div className={styles.subContentHeader}>
                                                                                        <span className={styles.spanTitle}>Role:</span>
                                                                                        <p className={styles.contentText}>{member.role}</p>
                                                                                    </div>

                                                                                    <div className={styles.subContentHeader}>
                                                                                        <span className={styles.spanTitle}>Social Media:</span>
                                                                                        <div className={styles.subContentHeader}>
                                                                                            <div className={styles.socialMediaContainer}>
                                                                                                {SocialLinksIcons.map((social) => {
                                                                                                    const link = member[social.name as keyof CampaignMemberEntity]; // Acceso directo
                                                                                                    return (
                                                                                                        link &&
                                                                                                        social && (
                                                                                                            <a
                                                                                                                href={formatLink(link as string)}
                                                                                                                key={social.name}
                                                                                                                target="_blank"
                                                                                                                rel="noopener noreferrer"
                                                                                                            >
                                                                                                                <SocialButton icon={social.icon} name={social.name} />
                                                                                                            </a>
                                                                                                        )
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <span className={styles.spanTitle}>Description:</span>
                                                                                    <p className={styles.contentText}>{member.description}</p>
                                                                                </div>
                                                                                {isEditing && (
                                                                                    <div className={styles.containerBtns}>
                                                                                        <button className={styles.editButton} onClick={() => handleOpenEditMember(member)}>
                                                                                            Edit
                                                                                        </button>
                                                                                        <button onClick={() => handleRemoveMember(member)} className={styles.deleteButton}>
                                                                                            <Image src="/img/icons/delete.svg" alt="deleteIcon" width={18} height={18} />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                    </Accordion>

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}

                {editingMember !== undefined && (
                    <FormCreateOrEditMember
                        member={members.find((member) => member.order === editingMember)}
                        handleSaveMember={(updatedMember) => {
                            handleUpdateMember(updatedMember);
                        }}
                        handleCancel={() => handleCancelEditMember()}
                    />
                )}
            </div>

            {editingMember === undefined && isEditing && (
                <div className={styles.buttonAddMember}>
                    <AddMore isOpen={isOpenAddMore} handleAddMore={() => handleOpenCreateMember()} />
                </div>
            )}

            {isOpenAddMore && (
                <FormCreateOrEditMember
                    handleSaveMember={(newMember) => {
                        handleAddMember(newMember);
                    }}
                    handleCancel={() => handleCancelEditMember()}
                />
            )}
        </section>
    );
};

export default CampaignMembersTab;
