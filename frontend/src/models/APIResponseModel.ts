export interface APIResponseModel<T> {
    status: number;
    data?: T;
}