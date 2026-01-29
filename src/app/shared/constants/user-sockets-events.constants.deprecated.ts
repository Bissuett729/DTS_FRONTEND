export const USER_SOCKET_EVENTS = {
    listeners: {
        // Eventos de Usuarios
        USER: {
            CREATED: 'user:created',
            UPDATED: 'user:updated',
            DELETED: 'user:deleted',
            PASSWORD_CHANGED: 'user:password-changed',
            PROFILE_IMAGE_UPDATED: 'user:profile-image-updated',
            STATUS_CHANGED: 'user:status-changed',
        },
    
        // Eventos de Tools
        TOOL: {
            CREATED: 'tool:created',
            UPDATED: 'tool:updated',
            DELETED: 'tool:deleted',
            ASSIGNED: 'tool:assigned',
            UNASSIGNED: 'tool:unassigned',
            REMOVED: 'tool:removed',
        },
    
        // Eventos de Tool Templates
        TOOL_TEMPLATE: {
            CREATED: 'tool-template:created',
            UPDATED: 'tool-template:updated',
            DELETED: 'tool-template:deleted',
            APPLIED: 'tool-template:applied',
        },
    
        // Eventos de Roles
        ROLE: {
            CREATED: 'role:created',
            UPDATED: 'role:updated',
            DELETED: 'role:deleted',
            ASSIGNED: 'role:assigned',
        },
    
        // Eventos de Departamentos
        DEPARTMENT: {
            CREATED: 'department:created',
            UPDATED: 'department:updated',
            DELETED: 'department:deleted',
        },
    
        // Eventos de Business Units
        BUSINESS_UNIT: {
            CREATED: 'business-unit:created',
            UPDATED: 'business-unit:updated',
            DELETED: 'business-unit:deleted',
        },
    
        // Eventos de Shifts
        SHIFT: {
            CREATED: 'shift:created',
            UPDATED: 'shift:updated',
            DELETED: 'shift:deleted',
        },
    
        // Eventos de Notificaciones
        NOTIFICATION: {
            CREATED: 'notification:created',
            UPDATED: 'notification:updated',
            DELETED: 'notification:deleted',
        },
    }
} as const;