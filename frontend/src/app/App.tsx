import './App.css'
let injectedProvider = false

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true
  console.log(window.ethereum)
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false

const App = () => {

  return (
    <div className="App">
      <h2>Injected Provider { injectedProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
      { isMetaMask && 
        <button>Connect MetaMask</button>
      }
    </div>
  )
}

export default App