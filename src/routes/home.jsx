import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'

import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import { getTournamentList } from './../util/api'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from './../contexts/AuthContext'
import ABI from './../abi/pepito.json'
import Hero from './../../src/assets/hero.png'
import Coin from './../../src/assets/coin.png'
import party from 'party-js'
import styles from './Home.module.scss'


party.resolvableShapes['coin'] = `<img src="${Coin}" style='width:24px'/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [councilMintPrice, setCouncilMintPrice] = useState(0)
  const [publicMintPrice, setPublicMintPrice] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [distance, setDistance] = useState(0)
  const [toggleCustom, setToggleCustom] = useState(false)
  const [councilMintExpiration, setCouncilMintExpiration] = useState('')
  const [councilMintExpirationDate, setCouncilMintExpirationDate] = useState('')
  const [maxSupply, setMaxSupply] = useState(0)
  const [candySecondaryColor, setCandySecondaryColor] = useState('#0E852E')
  const auth = useAuth()
  const navigate = useNavigate()
  const txtSearchRef = useRef()

  const addMe = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })
      console.log(whitelistFactoryContract.defaultChain, Date.now())
      await whitelistFactoryContract.methods
        .addUser(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const addUserByManager = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })

      await whitelistFactoryContract.methods
        .addUserByManager(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const updateWhitelist = async () => {
    web3.eth.defaultAccount = `0x188eeC07287D876a23565c3c568cbE0bb1984b83`

    const whitelistFactoryContract = new web3.eth.Contract('', `0xc407722d150c8a65e890096869f8015D90a89EfD`, {
      from: '0x188eeC07287D876a23565c3c568cbE0bb1984b83', // default from address
      gasPrice: '20000000000',
    })
    console.log(whitelistFactoryContract.defaultChain, Date.now())
    await whitelistFactoryContract.methods
      .updateWhitelist(web3.utils.utf8ToBytes(1), `q1q1q1q1`, false)
      .send()
      .then((res) => {
        console.log(res)
      })
  }

  const createWhitelist = async () => {
    console.log(auth.wallet)
    web3.eth.defaultAccount = auth.wallet

    const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET)
    await whitelistFactoryContract.methods
      .addWhitelist(``, Date.now(), 1710102205873, `0x0D5C8B7cC12eD8486E1E0147CC0c3395739F138d`, [])
      .send({ from: auth.wallet })
      .then((res) => {
        console.log(res)
      })
  }

  const handleSearch = async () => {
    let dataFilter = app
    if (txtSearchRef.current.value !== '') {
      let filteredData = dataFilter.filter((item) => item.name.toLowerCase().includes(txtSearchRef.current.value.toLowerCase()))
      if (filteredData.length > 0) setApp(filteredData)
    } else setApp(backApp)
  }

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }

    return false
  }

  const getPrice = async (type) => await contract.methods.price(type).call()
  const getCurrentPrice = async () => await contract.methods.getCurrentPrice().call()
  const getTotalSupply = async () => await contract.methods.totalSupply().call()

  const getCouncilMintExpiration = async () => await contract.methods.councilMintExpiration().call()

  const getMaxSupply = async () => await contract.methods.MAX_SUPPLY().call()

  const handleMint = async (e) => {
    let count
    if (document.querySelector(`#custom-count`) !== null) count = document.querySelector(`#custom-count`).value
    else count = document.querySelector(`#count`).value

    if (count < 1) {
      toast.error(`Please select/ enter the token count`)
      return
    }

    console.log(count)
    getCurrentPrice().then((price) => {
      price = (web3.utils.fromWei(price, 'ether') * count).toFixed(2).toString()
      console.log(price)

      const t = toast.loading(`Waiting for transaction's confirmation`)
      e.target.innerText = `Waiting...`
      if (typeof window.lukso === 'undefined') window.open('https://chromewebstore.google.com/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en-US&utm_source=candyzap.com', '_blank')

      try {
        window.lukso
          .request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            const account = accounts[0]
            console.log(account)
            // walletID.innerHTML = `Wallet connected: ${account}`;

            web3.eth.defaultAccount = account
            contract.methods
              .handleMint(count, 'pepito')
              .send({
                from: account,
                value: web3.utils.toWei(price, 'ether'),
              })
              .then((res) => {
                console.log(res) //res.events.tokenId

                // Run partyjs
                party.confetti(document.querySelector(`#egg`), {
                  count: party.variation.range(20, 40),
                  shapes: ['egg', 'coin'],
                })

                e.target.innerText = `Mint`
                toast.dismiss(t)
              })
              .catch((error) => {
                console.log(error)
                e.target.innerText = `Mint`
                toast.dismiss(t)
              })
            // Stop loader when connected
            //connectButton.classList.remove("loadingButton");
          })
          .catch((error) => {
            e.target.innerText = `Mint`
            // Handle error
            console.log(error, error.code)
            toast.dismiss(t)
            // Stop loader if error occured

            // 4001 - The request was rejected by the user
            // -32602 - The parameters were invalid
            // -32603- Internal error
          })
      } catch (error) {
        console.log(error)
        toast.dismiss(t)
        e.target.innerText = `Mint`
      }
    })
  }

  useEffect(() => {
    getPrice(`council_mint`).then(async (res) => {
      console.log(res)
      setCouncilMintPrice(web3.utils.fromWei(res, 'ether'))
      setIsLoading(false)
    })

    getPrice(`public_mint`).then(async (res) => {
      console.log(res)
      setPublicMintPrice(web3.utils.fromWei(res, 'ether'))
      setIsLoading(false)
    })

    getTotalSupply().then(async (res) => {
      setTotalSupply(web3.utils.toNumber(res))
      setIsLoading(false)
    })

    getMaxSupply().then(async (res) => {
      setMaxSupply(web3.utils.toNumber(res))
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <section className={`${styles.section} ms-motion-slideDownIn d-f-c`}>
        <div className={`${styles['__container']} __container`} data-width={`large`}>
          <ul className={`d-flex flex-row align-items-center justify-content-between`}>
            <li className={`d-flex flex-column align-items-start justify-content-between`}>
              <h1>Points that never vanish</h1>
              <p>Everything is tracked on a secure ledger, building trust and loyalty that lasts.</p>
              <Link to={`about`}>Read More</Link>
            </li>
            <li>
              <figure className={`${styles['hero']}`}>
                <img alt={import.meta.env.VITE_NAME} src={Hero} className={`animate blur`} />
              </figure>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}

export default Home
