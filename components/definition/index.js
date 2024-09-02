/**
 * Dependencies
 */
import PropTypes from 'prop-types';

/**
 * Outputs a definition value.
 *
 * @param {props} param0 props.
 * @param {string} param0.term term string.
 * @param {Node} param0.description term description
 * @returns
 */
const Definition = ({ term, children }) => (
  <dl style={{ margin: '1rem 0' }}>
    <dt>👉 <strong>{term}</strong></dt>
    <dd>{children}</dd>
  </dl>
);

Definition.propTypes = {};

export default Definition;
