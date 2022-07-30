export interface BackRespons {
    success: boolean;
    error: null | { message: string; statusCode: number };
}

export interface IRoutes {
    path: string;
    element: JSX.Element;
}
