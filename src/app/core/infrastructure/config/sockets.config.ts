import { environment } from "../../../../environments/environment";

export interface SocketConfig {
    name: string;
    url: string;
}

export const SOCKETS_CONFIG: Record<string, SocketConfig> = {
    User: { 
        name: 'socketUser', 
        url: environment.userURL 
    },
};
