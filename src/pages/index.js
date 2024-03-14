import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const postsByGroup = data.allMarkdownRemark.nodes
    .filter(x => x.frontmatter.group)
    .reduce((accum, post) => {
      return {
        ...accum,
        [post.frontmatter.group]: [
          ...(accum[post.frontmatter.group] || []),
          post,
        ],
      }
    }, {})

  return (
    <Layout location={location} title={siteTitle}>
      <ol style={{ listStyle: `none`, paddingLeft: 24, paddingRight: 24 }}>
        {Object.keys(postsByGroup).map(group => {
          const posts = postsByGroup[group]

          return (
            <li key={group}>
              <header style={{ marginBottom: 36 }}>
                <h2>{group}</h2>
              </header>

              <section>
                {posts.map(post => (
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="https://schema.org/Article"
                    key={post.frontmatter.title}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Link
                      to={post.fields.slug}
                      itemProp="url"
                      style={{ marginRight: 8 }}
                    >
                      <span itemProp="headline">{post.frontmatter.title}</span>
                    </Link>
                    <small style={{ textAlign: "right" }}>
                      {post.frontmatter.date}
                    </small>
                  </article>
                ))}
              </section>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          group
          title
          description
        }
      }
    }
  }
`
