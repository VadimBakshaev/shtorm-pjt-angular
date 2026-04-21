import { TypeVar } from "./modal-data.type";

export interface RequestParamsType {
    name: string;
    phone: string;
    type: TypeVar;
}

export interface OrderRequestParamsType extends RequestParamsType {
    service: string;
}