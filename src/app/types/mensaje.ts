import { IPersona } from "./persona";

export interface IMensaje{
    id?: number;
    created_at?: Date;
    mensaje?: string;
    //id_usuario: number;
    personas?: IPersona; 
}