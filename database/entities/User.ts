import {  Entity, Property, Unique } from "@mikro-orm/core";
import { EntityInitData } from "../types/types";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
    constructor(init: EntityInitData<User,'name'>) {
        super(init);
        this.name = init.name;
    }

    @Unique()
    @Property({ columnType: 'varchar(255)'})
    name: string;
}