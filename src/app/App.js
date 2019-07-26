import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { message } from 'antd';

// import 'antd/lib/message/style/css';
import './App.css';

class App extends Component {
    constructor (props) {
        super(props);
        const lct = this.props.location;
        this.url = `${lct.pathname}${lct.search}${lct.hash}`;
        this.state = {
            login: this.props.login,
            keyword: "",
            doSearch: false,
        }
    }

    componentWillMount() {
        document.title = "VPlayer"
    }

    handleSearch = (e) => {
        if (e.keyCode !== 13) {
            return
        }
        const keyword = e.target.value;
        if (keyword === "") {
            message.warning("search can't be empty")
            return
        }
        this.setState({keyword, doSearch: true});
    }

    handleFocus = (e) => {
        const {keyword} = this.state;
        e.target.value = keyword;
    }
    handleBlur = (e) => {
        const {keyword} = this.state;
        if(keyword === ""){
            e.target.value = "Input Search"
        }
    }

    handleChange = (e) => {
        this.setState({"search": e.target.value})
    }

    render() {
        const {login, keyword, doSearch} = this.state;
        return (
            <div className="App">
            {!login && <Redirect to={{
                pathname: "/login",
                from: this.url,
            }} /> }
            {doSearch && <Redirect push to={{
                pathname: "/search",
                search: `?keyword=${keyword}`
            }} /> }
            <div className="App-container">
            <section className="app__body">
                <input
                    className="App-search"
                    defaultValue="Input Search"
                    onKeyDown={this.handleSearch}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                />
            </section>
            </div>
            </div>
        );
    }
}

export default App;
