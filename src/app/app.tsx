import Router from "../router/router"
import { HashRouter } from "react-router-dom"
import { AppWrapper } from "dhis2-semis-components"

const App = () => {
  return (
    <AppWrapper dataStoreKey="semis/values">
      <HashRouter>
        <Router />
      </HashRouter>
    </AppWrapper>
  )
}

export default App