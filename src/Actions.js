import AppDispatcher from './AppDispatcher';

export default class Actions {
    static add(name) {
        AppDispatcher.dispatch({
            eventName: 'create-item',
            data: {name}
        });
    }
}