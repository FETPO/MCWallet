import React, { Component, Fragment } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import { injectIntl } from 'react-intl'
import styles from './Nav.scss'

import { constants } from 'helpers'
import { localisedUrl } from 'helpers/locale'

type NavProps = {
  menu: IUniversalObj[]
  intl: any
}

//@ts-ignore: strictNullChecks
@withRouter
@CSSModules(styles, { allowMultiple: true })
class Nav extends Component<NavProps, null> {
  render() {
    const {
      menu,
      intl: { locale },
    } = this.props

    const isDark = localStorage.getItem(constants.localStorage.isDark)

    return (
      <div styleName='nav'>
        <Fragment>
          {menu
            .filter(i => i.isDesktop !== false)
            .map(item => {
              const { title, link, exact, index, isExternal } = item

              return (
                <div styleName='mainMenu' key={`${title} ${link}`}>
                  {isExternal ? (
                    <a
                      href={link}
                      target="_blank"
                      styleName={`link ${isDark ? "dark" : ''}`}
                    >
                      {title}
                    </a>
                  ) : (
                    <NavLink
                      key={index}
                      exact={exact}
                      className={`${styles.link} ${isDark ? styles.dark : ''}`}
                      to={localisedUrl(locale, link)}
                      activeClassName={styles.active}
                    >
                      {title}
                    </NavLink>
                  )}
                </div>
              );
            })}
        </Fragment>
      </div>
    );
  }
}

//@ts-ignore: strictNullChecks
export default injectIntl(Nav)
