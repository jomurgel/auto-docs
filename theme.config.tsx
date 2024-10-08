/**
 * Dependencies
 */
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  docsRepositoryBase: 'https://github.com/jomurgel-auto-docs',
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  footer: {
    text: 'Partially-automated Engineering Documentation',
  },
  head: () => {
  	return <>
  		<style>{ ".nextra-sidebar-container { width: 20rem !important; }" }</style>
  	</>;
  },
  logo: (
		<svg
			viewBox="0 0 2884 2884"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				fillRule: 'evenodd',
				clipRule: 'evenodd',
				strokeLinejoin: 'round',
				strokeMiterlimit: 2
			}}
			height="36"
			width="36"
			focusable
		>
			<title>JM Logo</title>
			<path style={{ fill: 'none' }} d="M0 0h800v800H0z" transform="scale(3.60441)" />
			<path d="M.749.31C.695.268.623.116.569-.01l.009.083a.027.027 0 0 1-.009.023.029.029 0 0 1-.025.006A8.662 8.662 0 0 1 .462.078L.446.165.443.178A.027.027 0 0 1 .411.2.027.027 0 0 1 .39.168L.393.154C.399.12.406.089.41.061a1.745 1.745 0 0 1-.247-.105C.043-.108-.011-.171.002-.229.01-.268.037-.295.08-.308a.221.221 0 0 1 .059-.008c.088 0 .194.044.246.094a.273.273 0 0 1 .084.245L.52.039.495-.202a.027.027 0 0 1 .021-.029.028.028 0 0 1 .032.017c.028.078.094.245.154.362A.274.274 0 0 0 .697.12C.674-.012.68-.107.715-.163A.026.026 0 0 1 .74-.176c.01.001.019.007.023.017a.814.814 0 0 0 .068.136L.83-.071c.002-.095.02-.153.056-.176.013-.008.03-.005.038.008a.027.027 0 0 1-.008.037C.883-.181.878-.057.891.047a.027.027 0 0 1-.01.025.03.03 0 0 1-.027.004C.835.068.805.047.756-.045l-.015-.03a.995.995 0 0 0 .05.355.027.027 0 0 1-.01.031.03.03 0 0 1-.015.005A.027.027 0 0 1 .749.31ZM.095-.256c-.023.007-.036.02-.04.039-.005.023.027.068.134.126.062.033.14.066.227.096a.217.217 0 0 0-.069-.188.331.331 0 0 0-.208-.078.152.152 0 0 0-.044.005Zm.851-.007c0-.015.012-.027.027-.027S1-.278 1-.263a.028.028 0 0 1-.027.028.028.028 0 0 1-.027-.028Z" style={{ fillRule: 'nonzero' }} transform="matrix(2578.08309 0 0 -2578.08309 152.723 1441.764)" />
		</svg>
  ),
  primaryHue: 335,
  project: {
    link: 'https://github.com/jomurgel/auto-docs',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  }
}

export default config
