export interface IRoute {
    url: string;
    parsed: {
        host: string;
        path: string;
    }
}