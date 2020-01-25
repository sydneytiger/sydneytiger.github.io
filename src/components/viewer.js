import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import parseExpressions from 'selectors/parse_expressions';
import SplitPane from 'react-split-pane';

class Viewer extends Component {
  evaluateExpressions(expressions) {
    const formattedExpressions = _.mapValues(expressions, expression => {
      const result = eval(expression);

      try {
        if (result && result.type && result.props) {
          return result;
        } else if (_.isFunction(result) && result.name) {
          return <i>Function {result.name}</i>;
        } else if (_.isBoolean(result)) {
          return result ? 'True' : 'False';
        } else if (_.isFunction(result.print) && _.isFunction(result.matMul)) {
          return result.toString().replace('Tensor\n', '');
        } else if (_.isObject(result) || _.isArray(result)) {
          return JSON.stringify(result);
        }
      } catch (e) {
        return '';
      }

      return result;
    });

    return _.map(formattedExpressions, (expression, line) => {
      return <div>{expression}</div>;
    });
  }

  componentDidCatch(error, info) {
    return true;
  }

  renderExpressions(code) {
    return this.evaluateExpressions(this.props.expressions);
  }

  render() {
    const defaultHeight = window.innerHeight * 0.9;

    return (
      <SplitPane
        split="vertical"
        defaultSize={defaultHeight}
        className="viewer">
        <div className="result padding-top-xs padding-left-l cm-s-default">
          <span className="cm-header">Output</span>
          {this.renderExpressions(this.props.code)}
        </div>
        <div className="errors padding-top-xs padding-left-xs">
          {this.props.errors}
        </div>
      </SplitPane>
    );
  }ß
}

function mapStateToProps(state) {
  let expressions, errors;

  try {
    expressions = parseExpressions(state);
  } catch (e) {
    errors = e.toString();
  }

  return { expressions, errors };
}

export default connect(mapStateToProps)(Viewer);
