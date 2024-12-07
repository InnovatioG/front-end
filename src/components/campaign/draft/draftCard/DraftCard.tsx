import React, { useEffect } from 'react';
import styles from "../draftCard/DraftCard.module.scss";
import { Campaign } from '@/HardCode/databaseType';
import Link from 'next/link';
import Image from 'next/image';
import { categoriesById } from '@/utils/constants';
import GeneralButtonUI from '@/components/buttons/UI/Button';
import { useModalStore } from '@/store/modal/useModalStoreState';
import useDraftCard from '@/hooks/useDraftCard';

interface DraftCardProps {
    campaign: Campaign;
    isProtocolTeam: boolean;
}

const DraftCard: React.FC<DraftCardProps> = ({ campaign, isProtocolTeam }) => {
    const { openModal } = useModalStore();
    const { label, labelClass, buttons, timeRemaining, formatAllTime, currentMilestone } = useDraftCard(campaign, isProtocolTeam);







    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Image
                    width={58}
                    height={58}
                    src={campaign.logo_url}
                    alt="logo-company"
                    className={styles.logoCard}
                />
                <div className={styles.cardDetails}>
                    <div className={styles.statusContracts}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>

                            {campaign.state_id === 8 ? formatAllTime(timeRemaining) : label}
                            {campaign.state_id > 9 && ` ${currentMilestone}`}
                        </div>
                        <div className={styles.category}>
                            {categoriesById(campaign.category_id)}
                        </div>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.title}</h3>
            <h3 className={styles.cardDescription}>{campaign.description}</h3>
            <div className={styles.actionsTarget}>
                {buttons.map((button, index) => {
                    if (button.link) {
                        return (
                            <Link key={index} href={button.link(campaign.id)}>
                                <GeneralButtonUI
                                    text={button.label}
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, campaign.id))}
                                    classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                                >
                                    {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                </GeneralButtonUI>
                            </Link>
                        );
                    } else {
                        return (
                            <GeneralButtonUI
                                key={index}
                                text={button.label}
                                onClick={() => button.action && button.action((modalType) => openModal(modalType, campaign.id))}
                                classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                            >
                                {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                            </GeneralButtonUI>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default DraftCard;


/* [
    {
        "id": 10,
        "user_id": 1,
        "state_id": 11,
        "category_id": 6,
        "contract_id": 4,
        "vizualization": 2,
        "investors": 0,
        "title": "Campaña activa --- todavia no vencio la fecha para enviar reportes para los managers",
        "description": "El primer status del milestone tiene que ser de started y el resto de not started",
        "campaign_type": "Milestone",
        "milestones": [
            {
                "id": 1,
                "campaign_id": 11,
                "campaign_status_id": 2,
                "cmPercentage": 40,
                "cmEstimatedDeliveryDate": "2024-12-03T00:35:24.725Z",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 2,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 1,
                    "name": "Bit",
                    "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 2,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "cmEstimatedDeliveryDate": "2025-01-03T00:35:24.725Z",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 2,
                    "name": "in_progress",
                    "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 3,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "2025-02-03T00:35:24.725Z",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 3,
                    "name": "completed",
                    "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            }
        ],
        "goal": 500000,
        "raise_amount": 0,
        "start_date": "",
        "end_date": "",
        "logo_url": "/img/database/company_logo_id1.png",
        "banner_url": "/img/database/banner_logo_id1.png",
        "created_at": "",
        "updated_at": ""
    },
    {
        "id": 11,
        "user_id": 2,
        "state_id": 11,
        "category_id": 6,
        "contract_id": 2,
        "vizualization": 2,
        "investors": 0,
        "title": "Campaña activa --- estamos en el medio de los milestones asi que la config depende de los estados de los milestones",
        "description": "Campaña activa --- el manager ya envio el reporte y todavia no recibio un feedback.",
        "campaign_type": "Milestone",
        "milestones": [
            {
                "id": 1,
                "campaign_id": 11,
                "campaign_status_id": 1,
                "cmPercentage": 40,
                "cmEstimatedDeliveryDate": "2025-01-03T00:35:24.725Z",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 3,
                        "milestone_id": 1,
                        "milestone_status_id": 3,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 1,
                    "name": "Bit",
                    "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 2,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 2,
                    "name": "in_progress",
                    "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 3,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 3,
                    "name": "completed",
                    "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            }
        ],
        "goal": 500000,
        "raise_amount": 0,
        "start_date": "",
        "end_date": "",
        "logo_url": "/img/database/company_logo_id1.png",
        "banner_url": "/img/database/banner_logo_id1.png",
        "created_at": "",
        "updated_at": ""
    },
    {
        "id": 12,
        "user_id": 2,
        "state_id": 11,
        "category_id": 6,
        "contract_id": 2,
        "vizualization": 2,
        "investors": 0,
        "title": "Campaña activa --- estamos en el medio de los milestones asi que la config depende de los estados de los milestones",
        "description": "Campaña activa ---el manager envio un reporte pero fue rejected por el protocol_team.",
        "campaign_type": "Milestone",
        "milestones": [
            {
                "id": 1,
                "campaign_id": 11,
                "campaign_status_id": 1,
                "cmPercentage": 40,
                "cmEstimatedDeliveryDate": "5 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 4,
                        "approved_justification": "",
                        "rejected_justification": "Aca va la justificacion de porque los usuarios decidieron reporbar el reporte"
                    },
                    "id": 1,
                    "name": "Bit",
                    "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 2,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 2,
                    "name": "in_progress",
                    "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 3,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 3,
                    "name": "completed",
                    "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            }
        ],
        "goal": 500000,
        "raise_amount": 0,
        "start_date": "",
        "end_date": "",
        "logo_url": "/img/database/company_logo_id1.png",
        "banner_url": "/img/database/banner_logo_id1.png",
        "created_at": "",
        "updated_at": ""
    },
    {
        "id": 13,
        "user_id": 2,
        "state_id": 11,
        "category_id": 6,
        "contract_id": 2,
        "vizualization": 2,
        "investors": 0,
        "title": "Campaña activa --- estamos en el medio de los milestones asi que la config depende de los estados de los milestones",
        "description": "Un milestone fue Finished y el otro ya arranco",
        "campaign_type": "Milestone",
        "milestones": [
            {
                "id": 1,
                "campaign_id": 11,
                "campaign_status_id": 4,
                "cmPercentage": 40,
                "cmEstimatedDeliveryDate": "5 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 5,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 1,
                    "name": "Bit",
                    "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 2,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 2,
                    "name": "in_progress",
                    "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 3,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 3,
                    "name": "completed",
                    "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            }
        ],
        "goal": 500000,
        "raise_amount": 0,
        "start_date": "",
        "end_date": "",
        "logo_url": "/img/database/company_logo_id1.png",
        "banner_url": "/img/database/banner_logo_id1.png",
        "created_at": "",
        "updated_at": ""
    },
    {
        "id": 14,
        "user_id": 2,
        "state_id": 12,
        "category_id": 6,
        "contract_id": 2,
        "vizualization": 2,
        "investors": 0,
        "title": "Campaña activa --- estamos en el medio de los milestones asi que la config depende de los estados de los milestones",
        "description": "Campaña activa --- estamos en el medio de los milestones asi que la config depende de los estados de los milestones --- en este caso se aprobo el reporte.",
        "campaign_type": "Milestone",
        "milestones": [
            {
                "id": 1,
                "campaign_id": 11,
                "campaign_status_id": 1,
                "cmPercentage": 40,
                "cmEstimatedDeliveryDate": "5 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 5,
                        "approved_justification": "",
                        "rejected_justification": "Aca va la justificacion que manda el protocol tema explicando porque se rechazo el reporte, o porque se decidio pasar el milestone como un failed"
                    },
                    "id": 1,
                    "name": "Bit",
                    "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 2,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 2,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 2,
                    "name": "in_progress",
                    "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            },
            {
                "id": 3,
                "campaign_id": 2,
                "campaign_status_id": 1,
                "cmPercentage": 30,
                "status": "Not Started",
                "cmEstimatedDeliveryDate": "3 weeks",
                "milestone_status": {
                    "milestone_submission": {
                        "id_milestone_submission": 1,
                        "milestone_id": 1,
                        "milestone_status_id": 1,
                        "approved_justification": "",
                        "rejected_justification": ""
                    },
                    "id": 3,
                    "name": "completed",
                    "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
                    "created_at": "",
                    "updated_at": ""
                }
            }
        ],
        "goal": 500000,
        "raise_amount": 0,
        "start_date": "",
        "end_date": "",
        "logo_url": "/img/database/company_logo_id1.png",
        "banner_url": "/img/database/banner_logo_id1.png",
        "created_at": "",
        "updated_at": ""
    }
] */