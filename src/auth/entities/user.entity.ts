import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document{

    @Prop({required: true, type: String})
    name: string;

    @Prop({
        unique: true,
        required: true,
        type: String
    })
    email: string;

    @Prop({
        minlength: 6,
        required: true,
        type: String
    })
    password: string;

    @Prop({default: true, type: Boolean})
    isActive: boolean;

    // @Prop({ type: [String], default: ['user'] })
    @Prop({ type: Array, default: ['user'] })
    roles: string[];

    @Prop({ type: Date, default: Date.now })
    created: Date;
}
export const UserShema = SchemaFactory.createForClass(User);