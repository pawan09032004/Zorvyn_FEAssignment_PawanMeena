import PropTypes from "prop-types";

const SmartObservation = ({ text }) => {
  return (
    <aside className="bg-bg-surface p-8 border-l-4 border-accent relative">
      <span className="absolute left-4 top-1 text-6xl font-display italic text-accent/20">"</span>
      <blockquote className="pl-8">
        <p className="font-display text-3xl italic leading-tight text-text-primary">{text}</p>
      </blockquote>
      <p className="mt-6 pl-8 text-xs uppercase tracking-[0.16em] text-text-muted font-mono">
        Generated from current spending patterns.
      </p>
    </aside>
  );
};

SmartObservation.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SmartObservation;
