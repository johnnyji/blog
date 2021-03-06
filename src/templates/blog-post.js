import PropTypes from 'prop-types';
import React from 'react';
import {Link, graphql} from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout.tsx';
import SEO from '../components/seo';

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: {slug: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;

export default function BlogPostTemplate({data, pageContext}) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const {previous, next} = pageContext;

  return (
    <Layout title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1 style={{marginBottom: 0}}>{post.frontmatter.title}</h1>
          <p style={{display: `block`}}>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{__html: post.html}} />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
}

BlogPostTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      excerpt: PropTypes.string.isRequired,
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        date: PropTypes.string.isRequired,
        description: PropTypes.string,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    previous: PropTypes.object,
    next: PropTypes.object,
  }).isRequired,
};
