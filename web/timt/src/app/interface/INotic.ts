// Interface for notic
export interface INoticResponce{
    "id": number;
    "message": string;
}

export interface INoticRequest {
    "title": string;
    "content": string;
    "uploadId": null | string;
}