import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.scss'

export default class ScreenSaver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      show: false,
      timer_delay: (props.params && props.params.delay) || 5000,
      videos: (props.params && props.params.videos) || []
    }
  }
  setTimer(){
    this.resetTimer();
    const timer = setTimeout(() => {
      this.setState({show: true});
    }, this.state.timer_delay);
    this.setState({timer:timer});
  }
  resetTimer(){
    this.setState({show: false});
    this.state.timer && clearTimeout(this.state.timer);
    this.setState({timer: null});
  }
  componentWillMount() {
    this.setTimer();
  }
  componentWillUnmount() {
    this.resetTimer();
  }
  componentDidUpdate() {
    if(this.refs.video){
      ReactDOM.findDOMNode(this.refs.video).load(); // you can add logic to check if sources have been changed
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) !== JSON.stringify(this.state));
  }

  videoFinished() {
    this.setTimer();
  }
  render() {
    let video;
    if(this.state.show){
      video = (
        <video width='1920' height='1080' autoPlay='true' ref='video' onEnded={::this.videoFinished}>
          {
            this.state.videos.map((video, index) => (<source key={index} src={video.src} type={video.type}/>))
          }
        </video>);
    }

    return (<div className='screensaver'>
      { video }
    </div>);
  }
}
