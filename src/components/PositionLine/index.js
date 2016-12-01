import React, {Component} from 'react'

// import './styles.scss'

export default class PositionLine extends Component {
  render() {
    const color = this.props.color || '#0d313d';
    console.log(color);
    return (<div>
      <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='839' height='73' viewBox='0, 0, 839, 73'>
        <defs>
          <style>
            {
              `.position-line {
                fill-rule: evenodd;
                opacity: 0.65;
              }`
            }
          </style>
        </defs>
        <path className='position-line' fill={ color } d='M-106,722H764.965L829,790H-40.553' transform='translate(0 -717)'/>
      </svg>
    </div>)
  }
}