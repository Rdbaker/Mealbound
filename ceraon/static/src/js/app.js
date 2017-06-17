/**
 * Main application initialization
 *
 */

import React from 'react'
import ReactDOM from 'react-dom'

import SampleComponent from './sample-component.jsx'

// Initialize on Document Ready
document.addEventListener('DOMContentLoaded', () => {
  let main = document.getElementById('main');
  ReactDOM.render(<SampleComponent />, main);
})
