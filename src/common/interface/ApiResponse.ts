export interface ApiResult<T=object> {
    status?:number;
    data:T;
    message: string;
}