import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';





@asEntity()
export class MilestoneEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestone';
    protected static _className: string = 'Milestone';

    // #region fields
    @Convertible({ isDB_id: true })
    campaign_id!: string;
    @Convertible({ isDB_id: true })
    milestone_status_id!: string;
    @Convertible()
    estimate_delivery_date!: Date;
    @Convertible()
    percentage!: number;
    @Convertible()
    status!: number;
    @Convertible()
    description!: string;
    @Convertible({ isCreatedAt: true })
    created_at!: Date;
    @Convertible({ isUpdatedAt: true })
    updated_at?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaign_id: true,
        milestone_status_id: true,
        estimate_delivery_date: true,
        percentage: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
