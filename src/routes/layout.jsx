import { useEffect, useState } from 'react'
import { Outlet, useLocation, Link, NavLink, useNavigate, useNavigation } from 'react-router-dom'
import ConnectPopup from './components/ConnectPopup'
import { Toaster } from 'react-hot-toast'
import { web3, _, useAuth } from './../contexts/AuthContext'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Logo from './../../src/assets/logo.svg'
import Bag from './../../src/assets/pepito-bag.png'
import TelegramIcon from './../../src/assets/icon-telegram.svg'
import XIcon from './../../src/assets/icon-x.svg'
import CGIcon from './../../src/assets/icon-cg.svg'
import GitHubIcon from './../../src/assets/icon-github.svg'
import ArbitrumLogo from './../../src/assets/arbitrum-logo.svg'
import LuksoLogo from './../../src/assets/lukso-logo.svg'
import party from 'party-js'
import styles from './Layout.module.scss'

party.resolvableShapes['Logo'] = `<img src="${Logo}"/>`

let links = [
  {
    name: `Home`,
    icon: null,
    target: '',
    path: `/`,
  },
  {
    name: `What’s royalty program?`,
    icon: null,
    target: '',
    path: `royalty-program`,
  },
  {
    name: 'Ecosystem',
    icon: null,
    target: '',
    path: `ecosystem`,
  },
]

export default function Root() {
  const [network, setNetwork] = useState()
  const [isLoading, setIsLoading] = useState()
  const [connectPopup, setConnectPopup] = useState(false)
  const [balance, setBalance] = useState(0)
  const noHeader = ['/sss']
  const auth = useAuth()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const location = useLocation()

  const readBalance = async () => await web3.eth.getBalance(auth.wallet).then((balance) => web3.utils.fromWei(balance, 'ether').toString())

  useEffect(() => {
    readBalance().then((result) => setBalance(result))
  }, [])

  return (
    <>
      <Toaster />
      {connectPopup && <ConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />}

      <div className={styles.layout}>
        <header className={`${styles.header}`}>
          <div className={`__container d-flex flex-row align-items-center justify-content-between`} data-width={`xlarge`}>
            <div className={`${styles['left-side']} d-flex flex-row align-items-center justify-content-start`}>
              <Link to={`/`}>
                <div className={`d-flex flex-row align-items-center justify-content-start`} style={{ columnGap: `1rem` }}>
                  <figure className={`${styles['logo']} d-flex flex-row align-items-center justify-content-start`}>
                    <img alt={import.meta.env.VITE_TITLE} src={Logo} />
                    <figcaption>
                      <b>{import.meta.env.VITE_NAME}</b>
                    </figcaption>
                  </figure>
                </div>
              </Link>

              <ul className={`${styles['nav']} d-flex flex-row align-items-center justify-content-start`}>
                {links.map((item, i) => {
                  return (
                    <li key={i}>
                      <NavLink to={item.path} target={item.target}>
                        {item.name}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className={`d-flex align-items-center justify-content-end`}>
              <div className={`d-flex flex-row align-items-center justify-content-end`}>
                {!auth.wallet ? (
                  <>
                    <button className={`${styles['connect-button']}`} onClick={() => setConnectPopup(!connectPopup)}>
                      Run App
                    </button>
                  </>
                ) : (
                  <Link to={`user/dashboard`} className={`${styles['profile']} d-f-c user-select-none`}>
                    <b>{balance.length > 4 ? balance.slice(0, 5) : balance} ETH</b>

                    <div className={`${styles['profile__wallet']} d-f-c`}>
                      <img alt={``} src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${auth.wallet}`} />
                      <b> {auth.wallet && `${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}</b>
                    </div>

                    <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.03146 0.203529C1.04949 0.224679 1.10297 0.287479 1.13759 0.327578C1.20686 0.407828 1.30718 0.522877 1.4305 0.661176C1.67761 0.938224 2.01489 1.30597 2.37834 1.67222C2.74424 2.04097 3.12546 2.39681 3.46147 2.65656C3.6301 2.78696 3.77393 2.88256 3.88828 2.94291C3.94274 2.97166 3.97931 2.98631 4 2.99366C4.02068 2.98631 4.0572 2.97166 4.11172 2.94291C4.22606 2.88256 4.36989 2.78696 4.53853 2.65656C4.87448 2.39681 5.25575 2.04097 5.62164 1.67222C5.98514 1.30597 6.3224 0.938224 6.5695 0.661176C6.69281 0.522927 6.89928 0.283779 6.96854 0.203529C7.15574 -0.0188189 7.51347 -0.0663186 7.76759 0.0974802C8.02165 0.261229 8.07571 0.574477 7.88856 0.796825L7.88725 0.798375C7.81353 0.883724 7.59724 1.13432 7.47049 1.27642C7.21592 1.56182 6.86545 1.94412 6.48464 2.32781C6.10634 2.70906 5.6869 3.10321 5.29529 3.40595C5.10014 3.5568 4.89842 3.69555 4.70173 3.7993C4.52075 3.89475 4.27206 4 4 4C3.72788 4 3.47918 3.89475 3.29821 3.7993C3.10152 3.69555 2.89985 3.5568 2.7047 3.40595C2.3131 3.10321 1.89365 2.70906 1.51533 2.32781C1.13456 1.94407 0.784085 1.56182 0.529501 1.27637C0.401978 1.13342 0.297963 1.01412 0.225607 0.930274C0.189732 0.888724 0.131856 0.820774 0.111952 0.797425L0.111438 0.796775C-0.0757156 0.574476 -0.0216572 0.261179 0.232464 0.0974303C0.486586 -0.0663185 0.844304 -0.0188192 1.03146 0.203529Z"
                        fill="#70757A"
                      />
                    </svg>
                  </Link>
                )}
              </div>

              <div className={`connect-btn-party-holder`} />
            </div>
          </div>
        </header>

        {/*         
        <ul className={`${styles['profile__sub']}`}>
                      <li className={`d-flex flex-row align-items-center justify-content-stretch`}>
                        <figure>
                          <img alt={``} src={`https://ipfs.io/ipfs/${auth.profile && auth.profile.LSP3Profile.profileImage.length > 0 && auth.profile.LSP3Profile.profileImage[0].url.replace('ipfs://', '').replace('://', '')}`} />
                        </figure>
                        <div className={`d-flex flex-column align-items-center justify-content-center`}>
                          <b>Hi, {auth.profile && auth.profile.LSP3Profile.name}</b>
                          <span>{auth.wallet && `${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}</span>
                        </div>
                      </li>
                    </ul> */}

        <main>
          <Outlet />
        </main>

        <footer className={`${styles['footer']}`}>
          <div className={`${styles['network']}`}>
            <div className={`__container d-flex flex-row align-items-center justify-content-start`} data-width={`large`}>
              <span>Supported networks</span>
              <figure>
                <img alt={`Arbitrum`} src={ArbitrumLogo} className={`animate blur`} />
              </figure>
              <figure>
                <img alt={`Lukso`} src={LuksoLogo} className={`animate blur`} />
              </figure>
            </div>
          </div>

          <div className={`__container`} data-width={`large`}>
            <div className="grid grid--fit" style={{ '--data-width': `200px`, columnGap: `1rem` }}>
              <div className={`footer__card`}>
                <h3>{import.meta.env.VITE_NAME}</h3>
                <div className={`d-flex flex-row align-items-center justify-content-start ${styles['social']}`} style={{ columnGap: '.5rem' }}>
                  <a href={`//x.com/ArattaLabs`} target={`_blank`}>
                    <img alt={`X`} src={XIcon} />
                  </a>
                  <a href={`//github.com/web3senior/bluepoint`} target={`_blank`}>
                    <img alt={`GitHub`} src={GitHubIcon} />
                  </a>
                  <a href={`//t.me/arattalabs`} target={`_blank`}>
                    <img alt={`Telegram`} src={TelegramIcon} />
                  </a>
                </div>
                <p>
                  @ {new Date().getFullYear()} {import.meta.env.VITE_NAME}. All rights reserved.
                </p>
              </div>

              <div className={`footer__card`}>
                <h3 className={`text-left`}>Use cases</h3>
                <ul className={`d-flex flex-column align-items-start justify-content-center`}>
                  <li>
                    <Link to={``}>Telegram</Link>
                  </li>
                  <li>
                    <Link to={``}>Wallet Address</Link>
                  </li>
                </ul>
              </div>

              <div className={`footer__card`}>
                <h3 className={`text-left`}>Explore</h3>
                <ul className={`d-flex flex-column align-items-start justify-content-center`}>
                  <li>
                    <Link to={``}>Roadmap</Link>
                  </li>
                  <li>
                    <Link to={``}>Twitter</Link>
                  </li>
                  <li>
                    <Link to={``}>Telegram</Link>
                  </li>
                  <li>
                    <Link to={``}>Roadmap</Link>
                  </li>
                </ul>
              </div>

              <div className={`footer__card`}>
                <h3 className={`text-left`}>Developers</h3>
                <ul className={`d-flex flex-column align-items-start justify-content-center`}>
                  <li>
                    <Link to={``}>Contract</Link>
                  </li>
                  <li>
                    <Link to={``}>Admin</Link>
                  </li>
                  <li>
                    <Link to={``}>Repo</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
