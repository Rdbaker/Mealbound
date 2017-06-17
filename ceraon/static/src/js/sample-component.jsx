/**
 * Example Component
 *
 */
import React from 'react'

class SampleComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {count: 0}
  }

  handleClick() {
    this.setState({count: this.state.count + 1})
  }

  render() {
    return (
      <div>
        <h1>Test</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick.bind(this)}>Add</button>
      </div>
    )
  }
}

export default SampleComponent
