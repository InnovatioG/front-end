import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/General/Calendar/Calendar';
import { TimeInput } from '@/components/General/TimePicker/TimePicker';
import styles from './LaunchCampaignModal.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { HandlesEnums } from '@/utils/constants/constants';
import { TimeApi, toJson } from 'smart-db';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { getCampaignEX, cloneCampaignEX } from '@/utils/campaignHelpers';
import { set } from 'date-fns';
interface LaunchCampaignModalProps {}

const LaunchCampaignModal: React.FC<LaunchCampaignModalProps> = ({}) => {
    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date | undefined }>({ from: new Date() });
    // const [time, setTime] = useState('');
    const [campaign, setCampaign] = useState<CampaignEntity | undefined>();
    const [serverTime, setServerTime] = useState<number | undefined>();

    // const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     let value = event.target.value.replace(/\D/g, '');

    //     if (value.length > 2) {
    //         value = value.slice(0, 2) + ':' + value.slice(2, 4);
    //     }

    //     setTime(value);
    // };

    const { closeModal, handles, modalData } = useModal();

    const fetchCampaignById = async (id: string) => {
        try {
            const campaign: CampaignEntity | undefined = await CampaignApi.getByIdApi_(id, { doCallbackAfterLoad: true });
            setCampaign(campaign);
            const now = await TimeApi.getServerTimeApi();
            setServerTime(now);
        } catch (error) {
            console.error('Error fetching campaign:', error);
        }
    };

    useEffect(() => {
        if (modalData !== undefined && modalData.campaign_id) {
            fetchCampaignById(modalData.campaign_id);
        }
    }, []);

    useEffect(() => {
        if (campaign !== undefined && serverTime !== undefined) {
            function addDays(date: Date, days: number): Date {
                const result = new Date(date);
                result.setUTCDate(result.getUTCDate() + days);
                return result;
            }
            const now = serverTime;
            const newRange = {
                from: addDays(new Date(now), campaign.begin_at_days),
                to: addDays(new Date(now), campaign.deadline_days),
            };
            setDateRange(newRange);
        }
    }, [campaign, serverTime]);

    const handleClick = async () => {
        console.log(`handleClick: ${HandlesEnums.INITIALIZE_CAMPAIGN}`);

        if (handles && handles[HandlesEnums.INITIALIZE_CAMPAIGN]) {
            await handles[HandlesEnums.INITIALIZE_CAMPAIGN]({ beginAt: dateRange.from?.getTime(), deadline: dateRange.to?.getTime() });
        } else {
            alert(`No handle ${HandlesEnums.INITIALIZE_CAMPAIGN} provided`);
        }
    };
    return (
        <div className={styles.layout}>
            <h1>Select range date</h1>
            <Calendar mode="range" selected={dateRange} onSelect={(range) => range && setDateRange(range)} className="rounded-md border" />
            <div className={styles.hourMinutContainer}>
                {/* <TimeInput id="time-input" value={time} onChange={handleTimeChange} maxLength={5} /> */}
                Requested duration: {campaign?.deadline_days} days
            </div>
            <div className={styles.buttonContainer}>
                <BtnGeneral text="Cancel" onClick={() => closeModal()} classNameStyle="outlineb" />
                <BtnGeneral onClick={() => handleClick()} classNameStyle="fillb">
                    Confirm
                </BtnGeneral>
            </div>
        </div>
    );
};

export default LaunchCampaignModal;
