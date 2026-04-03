import PropTypes from "prop-types";

const EmptyState = ({ title, description }) => {
  return (
    <div className="bg-bg-surface p-10 border border-border/30 text-center">
      <p className="font-display text-3xl italic text-text-primary">{title}</p>
      <p className="text-sm text-text-muted mt-3 max-w-xl mx-auto">{description}</p>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default EmptyState;
