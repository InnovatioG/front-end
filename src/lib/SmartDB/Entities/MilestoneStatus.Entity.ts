import { } from '@lucid-evolution/lucid';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class MilestoneStatusEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestonestatus';
    protected static _className: string = 'MilestoneStatus';

    // #region fields
    @Convertible()
    code_id!: number;
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible({ isCreatedAt: true })
    createdAt!: Date;
    @Convertible({ isUpdatedAt: true })
    updatedAt?: Date;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
        code_id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
