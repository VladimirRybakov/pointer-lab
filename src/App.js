import React, { Component } from 'react';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      events: {},
      logs: [],
      pointer: true,
      touch: true,
      mouse: false,

      moves: false,
      clickDelay: '',
    };
  } 
  
  logEvent = (event, type) => {
    const {logs, moves, events} = this.state;
    
    const pickedOptions = [
      'pointerType', 
      'isPrimary', 
      'clientX', 
      'clientY',
      'offsetX', 
      'offsetY', 
      'pageX', 
      'pageY', 
      'screenX', 
      'screenY',
      'presure',
    ];

    if (
      event.target === this.target && 
      (
        events[type] !== event.type || 
        moves ||
        ( event.type !== 'pointermove' && event.type !== 'touchmove' && event.type !== 'mousemove' )
      )
    ) {
      console.log(event);

      logs.unshift({
        key: logs.length, 
        name: event.type,
        data: _.pick(event, pickedOptions),
        touches: _.map(event.touches, t => _.pick(t, pickedOptions)),
      });

      this.setState({logs, events: {...events, [type]: event.type}});  
    }
  }

  logPointerEvent = (event) => {
    if (this.state.pointer) {
      this.logEvent(event, 'pointer');
    }
  }

  logTouchEvent = (event) => {
    if (event.type === 'touchend') {
      this.delay = Date.now();
    }
    if (this.state.touch) {
      this.logEvent(event, 'touch');
    }
  }

  logMouseEvent = (event) => {
    if (event.type === 'click') {
      this.setState({clickDelay: Date.now() - this.delay});
    }
    if (this.state.mouse) {
      this.logEvent(event, 'mouse')
    }
  }

  handleClearLog = () => {
    this.setState({logs: []});
  }

  handleToggle = (type, value) => {
    this.setState({[type]: value});
  }

  componentDidMount() {
    [
      'pointerover',
      'pointerenter',
      'pointerout',
      'pointerleave',
      
      'pointerdown',
      'pointerup',
      'pointermove',

      'pointercancel',
      'gotpointercapture',
      'lostpointercapture',
    ].map(e => this.target.addEventListener(e, this.logPointerEvent));

    [
      'touchstart',
      'touchend',
      'touchmove',

      'touchcancel',
    ].map(e => this.target.addEventListener(e, this.logTouchEvent));

    [
      'mouseenter',
      'mouseleave',
      'mouseout',
      'mouseover',

      'mousedown',
      'mouseup',
      'mousemove',

      'click',
      'dblclick',
    ].map(e => this.target.addEventListener(e, this.logMouseEvent));
  }

  render() {
    const {logs} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div style={{margin: 24, userSelect: 'none'}}>
          <button onClick={this.handleClearLog}>Clear Log</button>

          <button 
            style={{opacity: this.state.pointer ? 1 : 0.3}} 
            onClick={() => this.handleToggle('pointer', !this.state.pointer)}
          >
            Pointer
          </button>
          
          <button 
            style={{opacity: this.state.touch ? 1 : 0.3}}
            onClick={() => this.handleToggle('touch', !this.state.touch)}
          >
            Touch
          </button>
          
          <button 
            style={{opacity: this.state.mouse ? 1 : 0.3}} 
            onClick={() => this.handleToggle('mouse', !this.state.mouse)}
          >
            Mouse
          </button>

          <button 
            style={{opacity: this.state.moves ? 1 : 0.3}} 
            onClick={() => this.handleToggle('moves', !this.state.moves)}
          >
            Moves
          </button>

          <span>
            click delay was {this.state.clickDelay || '...'}
          </span>

          { undefined &&
            _.map(
              ['text', 'email', 'tel', 'number', 'password', 'date', 'datetime', 'month', 'search', ], 
              type => 
                <input 
                  style = {{ width: 50, margin: 4 }}
                  key={type} 
                  type={type} 
                  value={type} 
                  onChange={() => {}}
                />
            )
          }

        </div>

        <div style={{margin: 24}}>
          <div 
            style={{padding: 24, backgroundColor: 'yellow', opacity: 0.6 }} 
            ref={ref => this.target = ref }
            role="button"
          >
            <div style={{height: 100, width: 150, backgroundColor: 'blue'}} />
          </div>
        </div>

        <div style={{margin: 24, height: 320, overflowY: 'scroll', backgroundColor: 'rgba(0,200,0,0.05)'}}>
          {_.map(logs, l => {
            return (
              <div key={l.key} style={{padding: 4, margin: 4, backgroundColor: 'rgba(0,0,0,0.1)'}} >
                {l.name} 
                {' '}
                <span style={{fontSize: '75%'}}>
                  {JSON.stringify(l.data, null, ' ')}
                </span>
                {' '}
                <span style={{fontSize: '75%'}}>
                  {JSON.stringify(l.touches, null, ' ')}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <a href="http://output.jsbin.com/xiculayadu">http://output.jsbin.com/xiculayadu</a>
        </div>

      </div>
    );
  }
}

export default App;
