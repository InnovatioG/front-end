import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class Campaign extends BaseEntity {
    protected static _apiRoute: string = 'campaign';
    protected static _className: string = 'Campaign';

    // #region fields

    @Convertible()
    name!: string;
    facebook!: string;

    // #endregion fields

    // #region db

    // When the field is not defined in the database, it will be set to the default value: {} means all fields
    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...BaseEntity.alwaysFieldsForSelect,
        name: true,
        facebook: true,
    };

    // #endregion db
}
