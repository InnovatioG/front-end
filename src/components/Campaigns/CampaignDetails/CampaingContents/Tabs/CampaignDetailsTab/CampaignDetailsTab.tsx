import TextEditor from '@/components/GeneralOK/Controls/TextEditor/TextEditor';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ModalsEnums } from '@/utils/constants/constants';
import { PageViewEnums } from '@/utils/constants/routes';
import Image from 'next/image';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EmptyState from '../EmpyState/EmptyState';
import styles from './CampaignDetailsTab.module.scss';
import useCampaignDetailsTab from './useCampaignDetailsTab';
import AddMore from '@/components/General/Buttons/AddMore/AddMore';

const CampaignDetailsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const {
        campaign,
        contents,
        contentsRefs,
        activeViewContent,
        closeModal,
        handleClickViewContent,
        handleClickEditContent,
        handleNewTitle,
        viewTitleOptions,
        setViewTitleOptions,
        defaultTitleOptions,
        handleAddContent,
        selectedContent,
        setSelectedContent,
        handleUpdateContent,
        handleRemoveContent,
        handleUpdateOrder,
    } = useCampaignDetailsTab(props);

    const NewTitleModal = () => {
        const [newOptionTitle, setNewOptionTitle] = useState('');

        const handleConfirm = () => {
            handleAddContent({ name: newOptionTitle });
            closeModal();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setNewOptionTitle(newValue);
        };

        return (
            <ModalTemplate active={ModalsEnums.EDIT_CONTENTS}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Add Index</h2>
                    <div className={styles.inputContainer}>
                        <input type="text" value={newOptionTitle} onChange={handleChange} placeholder="New section title" className={styles.input} />
                        <BtnGeneral text="Confirm" onClick={handleConfirm} />
                    </div>
                </div>
            </ModalTemplate>
        );
    };

    if ((contents === undefined || contents.length === 0) && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    if (props.pageView === PageViewEnums.MANAGE && props.isEditMode === true) {
        return (
            <main className={styles.projectLayout}>
                <div className={styles.sideBarNavigation}>
                    <DragDropContext onDragEnd={(result) => handleUpdateOrder(result)}>
                        <Droppable droppableId="contents-list">
                            {(provided) => (
                                <div className={styles.listContainer} {...provided.droppableProps} ref={provided.innerRef}>
                                    {contents.map((content, index) => (
                                        <Draggable key={content.order} draggableId={content.order.toString()} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={styles.listItem}>
                                                    <div className={styles.dragButton} {...provided.dragHandleProps}>
                                                        ⠿
                                                    </div>
                                                    <div
                                                        className={`${styles.buttonList} ${selectedContent?.order === content.order ? styles.active : ''}`}
                                                        onClick={() => handleClickEditContent(content)}
                                                        // >{`${content.order}. ${content.name}`}</div>
                                                    >{`${content.name}`}</div>
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
                        <AddMore
                            isOpen={viewTitleOptions}
                            handleAddMore={() => {
                                setViewTitleOptions(!viewTitleOptions);
                            }}
                        />
                    </div>

                    {viewTitleOptions === true && (
                        <div className={styles.otherOptions}>
                            {defaultTitleOptions.map((option) => (
                                <div key={option.name}>
                                    <BtnGeneral classNameStyle="buttonMenu" onClick={() => handleAddContent(option)} text={`${option.name}`} className={styles.buttonMenu} />
                                </div>
                            ))}
                            <BtnGeneral
                                classNameStyle="buttonMenu"
                                onClick={() => {
                                    handleNewTitle(<NewTitleModal />);
                                }}
                                text="+ Add free index"
                                className={styles.buttonMenu}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.content}>
                    {selectedContent !== undefined ? (
                        <div key={selectedContent._DB_id} id={`section-${selectedContent._DB_id}`} className={styles.container}>
                            {/* <div className={styles.titleContainer}>
                                <h2 className={styles.title}>{selectedContent.name}</h2>
                                <div className={styles.divisor}></div>
                            </div> */}
                            <div className={styles.content}>
                                <TextEditor
                                    title={selectedContent.name || 'Untitled'}
                                    content={selectedContent.description || ''}
                                    styleOption="quillEditor"
                                    onChange={(newContent) => {
                                        handleUpdateContent(newContent);
                                    }}
                                />
                            </div>
                            <button onClick={() => handleRemoveContent(selectedContent)} className={styles.deleteButton}>
                                <Image src="/img/icons/delete.svg" alt="deleteIcon" width={30} height={30} />
                            </button>
                        </div>
                    ) : (
                        <p>Please select an option to edit</p>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className={styles.projectLayout}>
            <div className={styles.sideBarNavigation}>
                <ul className={`${styles.listContainer} ${styles.sticky}`}>
                    {contents.map((content) => (
                        <li
                            key={content.order}
                            className={`${styles.buttonList} ${activeViewContent === content._DB_id ? styles.active : ''}`}
                            onClick={() => handleClickViewContent(content._DB_id)}
                        >
                            {content.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                {contents.map((content, index) => (
                    <div key={content._DB_id} id={`section-${content._DB_id}`} className={styles.container} ref={(el) => (contentsRefs.current[index] = el)}>
                        <div className={styles.titleContainer}>
                            <h2 className={styles.title}>{content.name}</h2>
                            <div className={styles.divisor}></div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: content.description || '' }} className={styles.content} />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default CampaignDetailsTab;
