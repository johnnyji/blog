/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { SocialIcon } from "react-social-icons"
import { StaticImage } from "gatsby-plugin-image"

const Bio = ({ isBlogPage }) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  return (
    <div className="bio">
      {isBlogPage && (
        <Link to="/">
          <StaticImage
            className="bio-avatar"
            layout="fixed"
            formats={["auto", "webp", "avif"]}
            src="../images/profile-pic.png"
            width={50}
            quality={95}
            alt="Profile picture"
          />
        </Link>
      )}
      <p>
        <strong>
          Co-founder & CTO at{" "}
          <a target="_blank" href="https://distru.com">
            Distru
          </a>{" "}
          | Forbes Under 30
        </strong>
        <div>
          Fun fact: I have 2 dogs, and a slightly above average head to body
          ratio.
        </div>
      </p>
      <div>
        <SocialIcon
          target="_blank"
          url="https://linkedin.com/in/johnnyji"
          style={{ height: 24, width: 24, marginLeft: 8, marginBottom: 8 }}
        />
        <SocialIcon
          target="_blank"
          url="https://tiktok.com/@gentletechbro"
          style={{ height: 24, width: 24, marginLeft: 8, marginBottom: 8 }}
        />
        <SocialIcon
          target="_blank"
          url="https://twitter.com/johnnyisji"
          style={{ height: 24, width: 24, marginLeft: 8, marginBottom: 8 }}
        />
        <SocialIcon
          target="_blank"
          url="mailto:johnny@johnnyji.com"
          style={{ height: 24, width: 24, marginLeft: 8, marginBottom: 8 }}
        />
      </div>
    </div>
  )
}

export default Bio
