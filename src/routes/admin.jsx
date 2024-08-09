import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import { getTournamentList } from '../util/api'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
import ABI from '../abi/pepito.json'

import Coin from './../../src/assets/coin.png'
import party from 'party-js'
import styles from './Home.module.scss'


party.resolvableShapes['coin'] = `<img src="${Coin}" style='width:24px'/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Admin({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [tournament, setTournament] = useState()
  const [councilMintPrice, setCouncilMintPrice] = useState(0)
  const [publicMintPrice, setPublicMintPrice] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [distance, setDistance] = useState(0)
  const [councilMintExpiration, setCouncilMintExpiration] = useState('')
  const [councilMintExpirationDate, setCouncilMintExpirationDate] = useState('')
  const [teamMintCounter, setTeamMintCounter] = useState(0)
  const [roadmap, setRoadmap] = useState([
    {
      stage: `Stage 0 - Spawn `,
      description: `Mint your Pepito Genesis NFT and join us on an adventure into the world of Pepito. The genesis NFT will have a total supply of 2424, of which 222 will be airdropped to holders of "Pepito's party" nfts. 1 genesis NFT per Pepito's party nfts held.`,
    },
    {
      stage: `Stage 1 - Hatchling`,
      description: `Activate your genesis NFT and watch it grow into a Pepito tadpole before you're eyes.`,
    },
    {
      stage: `Stage 2 - Metamorphosis `,
      description: `Begin the evolution! Start the metamorphosis process by sacrificing a small amount of $PEPITO tokens to the void (burn).`,
    },
    {
      stage: `Stage 3 - Anuran`,
      description: `Once the metamorphosis process is complete, your fully formed Pepito will be revealed in all its glory. A 3D pfp collection boasting a large number of traits and future access to a rigged 3D model.`,
    },
    {
      stage: `Stage 4 - The future and beyond, a parallel journey`,
      description: `<p>As you explore and grow in the lukso ecosystem so will your Pepito NFTs. Completing various tasks will allow access to a number of traits to create your own rarity.</p>

<p>&nbsp;</p>

<p>A shopfront will be available on our website to purchase limited edition traits using $PEPITO and LYX, some exclusive free traits are to be whitelisted for certain actions (vault contributions), Pepito council members, holders of certain collections and for competing in future games and contests. Once gone the traits will never return.</p>

<p>&nbsp;</p>

<p>Pepito council members will also receive 25% of the funds raised from the trait shop (LYX+$PEPITO) , divided between all backers. The remaining 75% of the funds raised in $PEPITO will be burned and the LYX raised from the trait shop will be sent to the vault for future prizes, competitions and administrative expenses.</p>
`,
    },
  ])
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
  const handlePause = async () => await contract.methods.pause().send()
  const getTotalSupply = async () => await contract.methods.totalSupply().call()

  const getCouncilMintExpiration = async () => await contract.methods.councilMintExpiration().call()

  const getTeamMintCounter = async () => await contract.methods.teamMintCounter().call()

  const handleTeamMint = async (e) => {
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
            .teamMint(document.querySelector(`#team`).value.split(','), "pepito")
            .send({
              from: account,
            })
            .then((res) => {
              console.log(res) //res.events.tokenId

              // Run partyjs
              party.confetti(document.querySelector(`.__container`), {
                count: party.variation.range(20, 40),
                shapes: [ 'coin'],
              })

              toast.success(`Done`)

              e.target.innerText = `Mint`
              toast.dismiss(t)
            })
            .catch((error) => {
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
  }

  const handleTransfer = async (e) => {
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
            .transferOwnership(document.querySelector(`#newOwner`).value)
            .send({
              from: account,
            })
            .then((res) => {
              console.log(res) //res.events.tokenId

              // Run partyjs
              party.confetti(document.querySelector(`.__container`), {
                count: party.variation.range(20, 40),
                shapes: ['egg', 'coin'],
              })

              toast.success(`Done`)

              e.target.innerText = `Transfer`
              toast.dismiss(t)
            })
            .catch((error) => {
              e.target.innerText = `Transfer`
              toast.dismiss(t)
            })
          // Stop loader when connected
          //connectButton.classList.remove("loadingButton");
        })
        .catch((error) => {
          e.target.innerText = `Transfer`
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
      e.target.innerText = `Transfer`
    }
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

    getTeamMintCounter().then(async (res) => {
      console.log(res)
      setTeamMintCounter(web3.utils.toNumber(res))
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <section className={`${styles.section} ms-motion-slideDownIn`}>
        <div className={`${styles['__container']} __container`} data-width={`medium`}>
          <div className={`card`}>
            <div className={`card__header`}>Team Mint</div>
            <div className={`card__body form`}>
              <label htmlFor="team">{teamMintCounter}/222</label>
              <textarea name="" id="team" placeholder="0x0, 0x1, 0x2"></textarea>
              <button className="btn mt-10" onClick={(e) => handleTeamMint(e)}>
                Team Mint
              </button>
            </div>
          </div>

          <div className={`card mt-10`}>
            <div className={`card__header`}>Transfer ownership</div>
            <div className={`card__body form`}>
              <div>
                 <input className='input' type="text" id="newOwner" />
              </div>
         
              <button className="btn mt-10" onClick={(e) => handleTransfer(e)}>
                Transfer
              </button>
            </div>
          </div>

          <Link to={`/`} className="btn mt-10" style={{ background: '#222' }}>
            Back
          </Link>
        </div>
      </section>
    </>
  )
}

export default Admin
