import { useEffect, useState } from 'react'
import { Outlet, useLocation, Link, NavLink, useNavigate, useNavigation } from 'react-router-dom'
import ConnectPopup from './components/ConnectPopup'
import { Toaster } from 'react-hot-toast'
import { web3, _, useAuth } from '../contexts/AuthContext'
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
import Icon from './helper/MaterialIcon'
import party from 'party-js'
import styles from './UserLayout.module.scss'

party.resolvableShapes['Logo'] = `<img src="${Logo}"/>`

const links = [
  {
    name: `Dashboard`,
    icon: <Icon name={`dashboard`} />,
    target: '',
    path: `dashboard`,
  },
  {
    name: `My Brand`,
    icon: <Icon name={`storefront`} />,
    target: '',
    path: `brand`,
  },
  {
    name: `Logic`,
    icon: <Icon name={`flowsheet`} />,
    target: '',
    path: `logic`,
  },
  {
    name: 'My Point',
    icon: <Icon name={`loyalty`} />,
    target: '',
    path: `point`,
  },
  {
    name: 'Transfer',
    icon: <Icon name={`send`} />,
    target: '',
    path: `transfer`,
  },
  {
    name: 'Map',
    icon: <Icon name={`map`} />,
    target: '',
    path: `map`,
  },
]

const footerLinks = [
  {
    name: `Need help?`,
    icon: null,
    target: '',
    path: `help`,
  },
  {
    name: `Documentation`,
    icon: null,
    target: '',
    path: `documentation`,
  },
  {
    name: 'NFT Tags',
    icon: null,
    target: '',
    path: `nft-tag`,
  },
  {
    name: 'Privacy Policy',
    icon: null,
    target: '',
    path: `privacy-policy`,
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
          <div className={`__container`} data-width={`xxlarge`}>
            <div className={`d-flex align-items-center justify-content-between`}>
              <h3 id={`pageTitle`} />

              {!auth.wallet ? (
                <>
                  <button className={`${styles['connect-button']}`} onClick={() => setConnectPopup(!connectPopup)}>
                    Run App
                  </button>
                </>
              ) : (
                <Link to={`profile`} className={`${styles['profile']} d-f-c user-select-none`}>
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
          </div>
        </header>

        <nav className={`d-flex flex-column align-items-center justify-content-between`}>
          <div className={`${styles['nav__top']} d-flex flex-column w-100`}>
            <Link to={`dashboard`} className={`${styles['logo']}`}>
                <figure className={`d-flex flex-row align-items-center justify-content-start`}>
                  <img alt={import.meta.env.VITE_TITLE} src={Logo} />
                  <figcaption>
                    <b>{import.meta.env.VITE_NAME}</b>
                  </figcaption>
                </figure>
            </Link>

            <ul className={`d-flex flex-column align-items-start justify-content-center`}>
              {links.map((item, i) => {
                return (
                  <li key={i}>
                    <NavLink to={item.path} target={item.target} className={`d-f-c`}>
                      {item.icon} {item.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <ul className={`${styles['nav__bottom']} d-flex flex-column align-items-start justify-content-center w-100`}>
            {footerLinks.map((item, i) => {
              return (
                <li key={i}>
                  <NavLink to={item.path} target={item.target} className={`d-f-c `}>
                    {item.icon} {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}
