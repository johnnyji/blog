import React from 'react';
import {Link} from 'gatsby';
import {Global, css} from "@emotion/core"
import styled from '@emotion/styled';

const GLOBAL_STYLES = css`
  body {
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  // Restyles Gatsby's two div wrappers around content so we can have a
  // full height page: https://github.com/gatsbyjs/gatsby/issues/7310
  #___gatsby,
  #gatsby-focus-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const SiteWrapper = styled("div")`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  margin: 24px auto;
  max-width: 900px;
`;

const ContentWrapper = styled('main')`
  flex: 1 1 0;
`;

const Layout = ({title, children}) => {
  const header: object = (
    <h3
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          color: `inherit`,
        }}
        to={`/`}
      >
        {title}
      </Link>
    </h3>
  );

  return (
      <SiteWrapper>
      <Global styles={GLOBAL_STYLES} />
        <header>{header}</header>
        <ContentWrapper>{children}</ContentWrapper>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </SiteWrapper>
  );
};

export default Layout;
