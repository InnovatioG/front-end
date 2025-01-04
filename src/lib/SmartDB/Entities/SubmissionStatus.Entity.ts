import {} from 'lucid-cardano';
import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class SubmissionStatusEntity extends BaseEntity {
    protected static _apiRoute: string = 'submissionstatus';
    protected static _className: string = 'SubmissionStatus';

    // #region fields
    @Convertible()
    id_internal!: number;
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
        id_internal: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    };

    // #endregion db
}
