import { RecoilRoot } from "recoil"
import Router from "../router/router"
import { HashRouter } from "react-router-dom"
import { AppWrapper } from "dhis2-semis-components"

const App = () => {
  return (
    <RecoilRoot>
      <AppWrapper dataStoreKey="semis/values">
        <HashRouter>
          <Router />
        </HashRouter>
      </AppWrapper>
    </RecoilRoot>
  )
}

export default App