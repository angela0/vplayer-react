import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Player } from 'video-react';
import { Spin } from 'antd';

import 'video-react/dist/video-react.css';
import './VPlayer.css';

class VPlayer extends Component {
    constructor (props) {
        super(props);
        const lct = this.props.location;
        this.url = `${lct.pathname}${lct.search}${lct.hash}`;
        const search = new URLSearchParams(this.props.location.search);
        const v = search.get("v")
        const t = search.get("t")

        this.state = {
            login: this.props.login,
            loading: true,
            playurl: `/vp/play?v=${v}&t=${t}`,
        };
    }

    componentWillMount() {
        document.title = "Player"
        this.setState({loading: false});
    }

    render() {
        const {login, loading, playurl} = this.state;
        console.log(playurl);
        return (
            <div className="VPlayer-container">
            {!login && <Redirect to={{
                pathname: "/login",
                from: this.url,
            }} />}
            { loading ?
                <div className="mask"> <div className="spin"><Spin /></div></div> :
                <Player
                    fluid={false}
                    width={791}
                    height={444}
                    playsInline
                    src={playurl}
                />
            }
            </div>
        )
    }
}

export default VPlayer;
