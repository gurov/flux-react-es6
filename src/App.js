import React from 'react';

import logo from './logo.svg';
import './App.css';
import listStore from './Store';
import Actions from './Actions';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.updateLogin = this.updateLogin.bind(this);
        this.createNewItem = this.createNewItem.bind(this);
        this.state = {
            searchLogin: 'gurov',
            items: [],
            errors: []
        };
    }

    componentDidMount() {
        listStore.onChangeListener(() => {
            this.setState({items: listStore.getAll()});
        });
        listStore.onErrorListener(() => {
            this.setState({errors: listStore.getErrors()});
        });
    }

    componentWillUnmount() {
        listStore.clearListeners();
    }

    createNewItem() {
        Actions.add(this.state.searchLogin);
    }

    showList() {
        return this.state.items.map((item) => {
            return (<img src={item.avatar_url}
                     key={item.id}
                     alt={item.login}
                     width="200"/>);
        });
    }

    showErrors() {
        return this.state.errors.map((item) => {
            return (<li key={item.id}><small>({item.date.toLocaleString()}) </small>{item.text}</li>);
        });
    }


    updateLogin(e) {
        this.setState({searchLogin: e.target.value});
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>React, Flux, ES6</h2>
                </div>
                <p>
                    Enter <strong>github</strong> login: &nbsp;
                    <input type="text"
                           value={this.state.searchLogin}
                           onChange={this.updateLogin}/>
                    <button onClick={this.createNewItem}
                            disabled={!this.state.searchLogin}>Load avatar</button>
                </p>
                <table className="lists">
                    <thead>
                    <tr>
                        <td>Avatars</td>
                        <td>Errors</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <ul>
                                {this.showList()}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                {this.showErrors()}
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );
    }
}

export default App;
