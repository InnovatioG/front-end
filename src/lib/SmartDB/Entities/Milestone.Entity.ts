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
    estimate_delivery_days!: number;
    @Convertible()
    estimate_delivery_date!: Date;
    @Convertible()
    percentage!: number;
    @Convertible()
    description!: string;
    @Convertible()
    order!: number;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaign_id: true,
        milestone_status_id: true,
        estimate_delivery_days: true,
        estimate_delivery_date: true,
        percentage: true,
        description: true,
        order: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
