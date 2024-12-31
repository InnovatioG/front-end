import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class MilestoneEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestone';
    protected static _className: string = 'Milestone';

    // #region fields
    @Convertible({ isDB_id: true })
    campaignId!: string;
    @Convertible({ isDB_id: true })
    milestoneStatusId!: string;
    @Convertible()
    estimateDeliveryDate!: Date;
    @Convertible()
    percentage!: number;
    @Convertible()
    status!: number;
    @Convertible()
    description!: string;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        campaignId: true,
        milestoneStatusId: true,
        estimateDeliveryDate: true,
        percentage: true,
        status: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
