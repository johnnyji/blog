import * as React from "react"
import { Link, graphql, navigate } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { tagLabel, tagPath } from "../utils/tags"

const tagFromSearch = search =>
  new URLSearchParams(search || "").get("tag") || null

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  // The filter lives in the URL (/?tag=hiring) so post pages can link to it.
  // It's read after mount, since the static HTML is built without a query.
  const [activeTag, setActiveTag] = React.useState(null)
  const sidebarList = React.useRef(null)
  React.useEffect(() => {
    setActiveTag(tagFromSearch(location.search))
  }, [location.search])

  // On a phone the sidebar is a sideways-scrolling row; bring the active tag into view.
  React.useEffect(() => {
    const list = sidebarList.current
    const active = list?.querySelector(`[aria-pressed="true"]`)
    if (!list || !active || list.scrollWidth <= list.clientWidth) return
    list.scrollLeft +=
      active.getBoundingClientRect().left - list.getBoundingClientRect().left - 16
  }, [activeTag])

  const counts = posts.reduce((accum, post) => {
    ;(post.frontmatter.tags || []).forEach(tag => {
      accum[tag] = (accum[tag] || 0) + 1
    })
    return accum
  }, {})
  const tags = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a] || a.localeCompare(b)
  )
  const visiblePosts = activeTag
    ? posts.filter(post => (post.frontmatter.tags || []).includes(activeTag))
    : posts

  const selectTag = tag => {
    navigate(tag && tag !== activeTag ? tagPath(tag) : "/")
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className="post-index">
        <aside className="tag-sidebar">
          <h2 className="tag-sidebar-heading">Topics</h2>
          <ul ref={sidebarList}>
            <li>
              <button
                type="button"
                aria-pressed={!activeTag}
                onClick={() => selectTag(null)}
              >
                <span>All posts</span>
                <span className="tag-count">{posts.length}</span>
              </button>
            </li>
            {tags.map(tag => (
              <li key={tag}>
                <button
                  type="button"
                  aria-pressed={activeTag === tag}
                  onClick={() => selectTag(tag)}
                >
                  <span>{tagLabel(tag)}</span>
                  <span className="tag-count">{counts[tag]}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <ol className="post-list">
          {visiblePosts.map(post => (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="https://schema.org/Article"
              >
                <div className="post-list-item-top">
                  <Link to={post.fields.slug} itemProp="url">
                    <span itemProp="headline">{post.frontmatter.title}</span>
                  </Link>
                  <small>{post.frontmatter.date}</small>
                </div>
                <p className="post-list-item-summary" itemProp="description">
                  {post.frontmatter.description || post.excerpt}
                </p>
                <div className="post-tags">
                  {(post.frontmatter.tags || []).map(tag => (
                    <Link key={tag} to={tagPath(tag)}>
                      #{tag}
                    </Link>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
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
          tags
          title
          description
        }
      }
    }
  }
`
