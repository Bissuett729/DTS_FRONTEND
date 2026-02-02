// Interfaz para la forma del error 
export interface IHttpError {
    status?: number;
    code?: string;
    message?: string; 
    msg?: { message?: string };
};

// Interfaz para el objeto de error que lanzamos
export interface IErrorPayload {
    message: string;
    originalError: IHttpError;
};