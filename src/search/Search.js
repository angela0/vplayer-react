import React, { Component } from 'react';
import { Spin, message, List, Avatar, Button } from 'antd';
import { Redirect } from 'react-router-dom';

import './Search.css';


class Search extends Component {
    constructor (props) {
        super(props);
        const search = new URLSearchParams(this.props.location.search);
        this.keyword = search.get("keyword");
        const lct = this.props.location;
        this.url = `${lct.pathname}${lct.search}${lct.hash}`;
        this.state = {
            login: this.props.login,
            dataSource: [],
            pulled: false,
            page: 0,
            loadingMore: false,
        };
    }

    componentWillMount() {
        document.title = "Beauties"
        this.getData()
    }

    getData = () => {
        if (this.keyword === null || this.keyword === "") {
            this.keyword = "default";
        }
        const {page, dataSource} = this.state;
        fetch(`/vp/search?keyword=${this.keyword}&page=${page}`, {
            credentials: 'include',
        }).then( response => {
            if (!response.ok) {
                throw response.headers.get("X-Message")
            }
            return response.json();
        }).then( data => {
            this.setState({dataSource: dataSource.concat(data), page: page+1, pulled: true, loadingMore: false});
        }).catch( err => {
            this.setState({loadingMore: false});
            message.error(err);
        })
    }

    handleLoadMore = (e) => {
        this.setState({loadingMore: true});
        this.getData();
    }

    render() {
        const {pulled, dataSource, loadingMore, login} = this.state;
        const loadMore = (<div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore ? 
            <Spin />
            :
            <Button onClick={this.handleLoadMore}>loading more</Button>
        }
      </div>)
        return (
            <div className="Search-result">
            {!login && <Redirect to={{
                pathname: "/login",
                from: this.url,
            }} /> }
            { 
                !pulled ? 
                    <div className="Search-spin"><Spin /></div> :
                    <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={dataSource}
                    loadMore={loadMore}
                    renderItem={item => (
                        <List.Item
                        key={item.title}
                        extra={<img width={272} alt="logo" src={`/vp/thumb?v=${encodeURIComponent(item.thumb)}`} />}
                        >
                        <List.Item.Meta
                        avatar={<Avatar src={item.thumb} />}
                        title={<a href={`/vplayer?v=${item.link}&t=${item.source}`} target="_blank">{item.title}</a>}
                        description={`${item.duration} ${item.source}`}
                        />
                        </List.Item>
                    )}
                    />
            }
            </div>
        )    
    }
}

export default Search;
