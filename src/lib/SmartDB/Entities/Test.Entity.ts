import 'reflect-metadata';
import { BaseEntity, Convertible, asEntity } from 'smart-db';

@asEntity()
export class TestEntity extends BaseEntity {
    protected static _apiRoute: string = 'test';
    protected static _className: string = 'Test';

    // #region fields

    @Convertible()
    name!: string;

    @Convertible()
    description!: string;

    // #endregion fields

    // #region  db

    // When the field is not defined in the database, it will be set to the default value: {} means all fields
    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...BaseEntity.alwaysFieldsForSelect,
        name: true,
    };

    // #endregion  db
}
