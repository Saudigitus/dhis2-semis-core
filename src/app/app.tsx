import { AppWrapper } from "dhis2-semis-components"
import Router from "../router/router"

const App = () => {
  return (
    <AppWrapper dataStoreKey="dataStore/semis/values">
      <Router />
    </AppWrapper>
  )
}

export default App