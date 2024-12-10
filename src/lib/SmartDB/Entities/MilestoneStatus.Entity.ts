import 'reflect-metadata';
import { Convertible, BaseEntity, asEntity } from 'smart-db';
import {  } from 'lucid-cardano';

@asEntity()
export class MilestoneStatusEntity extends BaseEntity {
    protected static _apiRoute: string = 'milestonestatus';
    protected static _className: string = 'MilestoneStatus';


    // #region fields
    @Convertible()
    name!: string;
    @Convertible()
    description?: string;
    @Convertible()
    createAt!:  Date ;
    @Convertible()
    updateAt?:  Date ;

    // #endregion fields

    // #region db

    public static defaultFieldsWhenUndefined: Record<string, boolean> = {};

    public static alwaysFieldsForSelect: Record<string, boolean> = {
        ...super.alwaysFieldsForSelect,
          name: true,
          description: true,
          createAt: true,
          updateAt: true,
    };

    // #endregion db
}


