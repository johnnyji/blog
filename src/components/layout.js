import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Bio from "../components/bio"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <section
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Link to="/">
          <StaticImage
            className="bio-avatar"
            layout="fixed"
            formats={["auto", "webp", "avif"]}
            src="../images/profile-pic.png"
            width={100}
            quality={95}
            alt="Profile picture"
            style={{ flex: "0 0 100px" }}
          />
        </Link>

        <section style={{ maxWidth: 450 }}>
          <h1 className="main-heading" style={{ marginBottom: 16 }}>
            <Link to="/">Johnny Ji</Link>
          </h1>

          <Bio isBlogPage={false} />
        </section>
      </section>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        Johnny Ji
      </Link>
    )
  }

  return (
    <div
      className="global-wrapper"
      data-is-root-path={isRootPath}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header className="global-header">{header}</header>
      <main style={{ flex: "1 1 auto" }}>{children}</main>
      <footer style={{ marginTop: 36 }}>📧 johnny@johnnyji.com</footer>
    </div>
  )
}

export default Layout
