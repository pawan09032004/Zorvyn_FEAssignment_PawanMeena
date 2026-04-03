import React from "react";
import PropTypes from "prop-types";

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally swallowed to avoid crashing analytics views.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-bg-surface p-6 text-sm text-text-muted border border-border/30">
          Unable to render {this.props.title}.
        </div>
      );
    }

    return this.props.children;
  }
}

ChartErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

ChartErrorBoundary.defaultProps = {
  title: "chart",
};

export default ChartErrorBoundary;
