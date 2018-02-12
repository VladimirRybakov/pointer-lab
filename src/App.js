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

      fingerVisible: false,
      fingerLeft: 0,
      fingerTop: 0,
    };
  }

  logEvent = (event, type) => {
    const {logs, moves, events} = this.state;
    console.log(event);

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
    ]

    if (
      event.target === this.eventLogger &&
      (
        events[type] !== event.type ||
        moves ||
        ( event.type !== 'pointermove' && event.type !== 'touchmove' && event.type !== 'mousemove' )
      )
    ) {
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
    if (this.state.touch) {
      this.logEvent(event, 'touch');
    }
  }

  logMouseEvent = (event) => {
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

  showFinger = (e) => {
    this.setState({
      fingerVisible: true,
      fingerLeft: e.offsetX,
      fingerTop: e.offsetY,
    });
  }

  moveFinger = (e) => {
    this.setState({
      fingerVisible: true,
      fingerLeft: e.offsetX,
      fingerTop: e.offsetY,
    });
  }

  hideFinger = (e) => {
    this.setState({
      fingerVisible: false,
    });
  }

  componentDidMount() {
    [
      'pointerover',
      'pointerenter',
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointerout',
      'pointerleave',

      'pointercancel',
      'gotpointercapture',
      'lostpointercapture',
    ].map(e => this.eventLogger.addEventListener(e, this.logPointerEvent));

    [
      'touchstart',
      'touchend',
      'touchmove',
      'touchcancel',
    ].map(e => this.eventLogger.addEventListener(e, this.logTouchEvent));

    [
      'click',
      'dblclick',

      'mousedown',
      'mouseenter',
      'mouseleave',
      'mousemove',
      'mouseout',
      'mouseover',
      'mouseup',
    ].map(e => this.eventLogger.addEventListener(e, this.logMouseEvent));

    this.fingerPath.addEventListener('pointerenter', this.showFinger);
    // this.debouncedMoveFinger = _.debounce(this.hideFinger, 100);
    // this.fingerPath.addEventListener('pointermove', this.debouncedMoveFinger);
    this.fingerPath.addEventListener('pointermove', this.moveFinger);
    this.fingerPath.addEventListener('pointerleave', this.hideFinger);
  }

  render() {
    const {logs} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div>
          Just github test
        </div>

        <div style={{padding: 24, position: 'relative'}}>
          <svg width="320" viewBox="2, 2, 160, 76">
            <path
              ref={ref => this.fingerPath = ref}
              style={{
                fill: '#00ed00',
                'fillOpacity': 0.64761909,
                stroke: '#070000',
                'strokeWidth': 1.5,
                'strokeOpacity': 0.25
              }}
              d="m 28.202202,4.2217757 c -4.972977,0.01449 -9.618568,0.140835 -13.65625,0.07617 -5.567319,-0.15479 -10.1884713,4.268218 -10.2776672,9.8369693 -0.089196,5.568752 4.3879342,10.137489 9.9573542,10.161078 9.230243,0.14782 19.128667,-0.388769 27.691406,0.431641 8.388865,0.80375 14.839722,2.900435 18.773438,6.546875 3.843011,4.657274 4.630587,7.313506 6.392578,11.654297 1.809759,4.458471 5.451399,10.859271 12.462891,15.740241 20.677368,15.85121 46.812668,14.75041 69.115228,15.25976 5.58269,0.21839 10.26164,-4.17932 10.38932,-9.76481 0.12767,-5.5855 -4.34545,-10.19241 -9.93229,-10.22933 -22.96996,-0.52459 -44.11138,-0.79858 -57.589836,-11.25 L 91.292045,42.501073 91.045952,42.333105 C 87.298918,38.954081 85.614311,35.40537 85.614311,35.40537 83.147107,32.367099 81.752227,25.136023 75.553764,17.831151 l -0.314453,-0.36914 -0.349609,-0.339844 C 66.061021,8.5608817 54.523608,5.8425067 43.825248,4.8174787 38.476069,4.3049657 33.175178,4.2072857 28.202202,4.2217757 Z"
            />
          </svg>

          {!this.state.fingerVisible ? null :
            <div
              style={{
                position: 'absolute',
                top: this.state.fingerTop,
                left: this.state.fingerLeft,
                width: 36,
                height: 36,
                backgroundColor: 'rgba(0, 43, 250, 0.8)',
                borderRadius: '50%',
                pointerEvents: 'none',
                border: '4px solid rgba(0, 0, 0, 0.25)'
              }}
            >
            </div>
          }
        </div>

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
            ref={ref => this.eventLogger = ref }
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

      </div>
    );
  }
}

export default App;
