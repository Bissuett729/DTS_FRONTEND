export const USER_SOCKETS_EVENTS = {
    listener: {
        USER_CREATED: 'user:created',
        USER_UPDATED: 'user:updated',
        USER_DELETED: 'user:deleted',
    },
    emitter: {
        CREATE_USER: 'user:create',
        UPDATE_USER: 'user:update',
        DELETE_USER: 'user:delete',
    }
}