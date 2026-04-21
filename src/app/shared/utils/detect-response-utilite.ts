import { DefaultResponseType } from "../../../types/default-response.type";

export class DetectResponseUtilite {
    public static isErrorResponse<T>(response: T | DefaultResponseType): response is DefaultResponseType {
        return response &&
            typeof response === 'object' &&
            'error' in response &&
            response.error === true &&
            'message' in response;
    }
}