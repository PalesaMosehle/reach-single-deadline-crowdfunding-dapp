import React from 'react';

const exports = {};

// User views must be extended.
// It does not have its own Wrapper view.

exports.Done = class extends React.Component {
  render() {
    const { outcome } = this.props;
    return (
      <div>
        The outcome of the process was:
        <br />{outcome || 'Unknown'}
      </div>
    );
  }
}

exports.Timeout = class extends React.Component {
  render() {
    return (
      <div>
        There's been a timeout. (Someone took too long.)
      </div>
    );
  }
}

export default exports;
