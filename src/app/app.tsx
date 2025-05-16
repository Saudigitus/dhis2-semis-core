import Router from "../router/router"
import { AppWrapper } from "dhis2-semis-components"

const App = () => {
  return (
    <AppWrapper dataStoreKey="dataStore/semis/values">
      <Router />
    </AppWrapper>
  )
}

export default App