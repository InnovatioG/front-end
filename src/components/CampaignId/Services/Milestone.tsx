import { MilestoneEntity } from '@/lib/SmartDB/Entities';
import { MilestoneApi } from '@/lib/SmartDB/FrontEnd';
import type { Milestone } from '@/types/types';



export const updateMilestoneInformation = async (milestone: Milestone) => {
    try {
        if (!milestone._DB_id) {
            throw new Error("milestone._DB_id is undefined");
        }
        const { milestone_submissions, ...milestoneData } = milestone;
        let entity = new MilestoneEntity(milestoneData);
        console.log(milestoneData);
        entity = await MilestoneApi.updateWithParamsApi_(milestone._DB_id, entity);

        console.log('Milestone updated successfully:', entity);
    } catch (error) {
        console.error('Error updating milestone:', error);
    }
};


/* 
{
    _DB_id: '53',
    campaign_id: '30',
    milestone_status_id: '1',
    estimate_delivery_days: undefined,
    estimate_delivery_date: undefined,
    milestone_submissions: [],
    percentage: undefined,
    description: 
      '<p><strong>Hello Johnatan, how are you doing? </strong></p><p><br></p><p><br></p><ol><li>Top 5 </li><li>Top 4 </li><li>Top 3 </li></ol><p><br></p><h1>Señor kioskero devuelvame el dinero</h1>',
    createdAt: '2025-01-16T23:05:59.162Z',
    updatedAt: '2025-01-16T23:05:59.162Z'
  }



 {
    _DB_id: '56',
    campaign_id: '30',
    milestone_status_id: '1',
    estimate_delivery_days: 4,
    percentage: 40,
    description: 'sabor',
    createdAt: new Date('2025-01-17T19:16:43.000Z'),
    updatedAt: new Date('2025-01-17T19:16:43.000Z')
  }

*/