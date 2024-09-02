import { Callout } from 'nextra-theme-docs';

/**
 * Outputs Confluence coming soon message.
 *
 * @param {props} param0 props.
 * @param {string} param0.link link to confluence page.
 * @returns
 */
const ConfluenceComingSoon = ({ link }) => (
  <Callout type="info" emoji="ℹ️">
    Content coming soon. Until then, please visit <a href={link} target="_blank">{link}</a>
  </Callout>
);

export default ConfluenceComingSoon;
