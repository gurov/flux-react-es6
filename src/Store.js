import {EventEmitter} from 'events';
import AppDispatcher from './AppDispatcher';

const CHANGE_EVENT = 'change';
const ERROR_EVENT = 'error';

let listStore = null;

class ListStore extends EventEmitter{

    constructor (props) {
        super(props);
        this.items = [];
        this.errors = [];

        if (listStore) {
            listStore = this;
        }

        this.dispatcherToken = AppDispatcher.register((payload) => {
            if (payload.eventName === 'create-item') {
                this.push(payload.data)
            }
            return true;
        });

        return listStore;
    }

    genErrObj(s) {
        this.errors.push({
            id: Math.random(),
            text: s,
            date: new Date(),
        });
        this.emit(ERROR_EVENT);
    }

    push(item) {

        const userExist = this.items.some((user) => user.login === item.name);
        if (userExist) {
            this.genErrObj('Login ' + item.name + ' have been added!');
            return;
        }

        fetch('https://api.github.com/users/' + item.name).then((response) => {
            if (response.status !== 200) {
                response.json().then((data) => {
                    this.genErrObj('Status Code: ' + response.status + ' ' + data.message);
                });
                return;
            }
            response.json().then((data) => {
                this.items.push(data);
                this.emit(CHANGE_EVENT);
            });
        }).catch((err) => {
            this.genErrObj('Fetch Error:' + err);
        });
    }

    getAll() {
        return this.items;
    }

    getErrors() {
        return this.errors;
    }

    onChangeListener(callback) {
        listStore.on(CHANGE_EVENT, callback);
    }

    onErrorListener(callback) {
        listStore.on(ERROR_EVENT, callback);
    }

    clearListeners() {
        this.removeAllListeners([CHANGE_EVENT, ERROR_EVENT]);
    }
}

listStore = new ListStore();

export default listStore;
