import { useConfig } from "@dhis2/app-runtime"
import Router from "../router/router"
import { AppWrapper } from "dhis2-semis-components"

const App = () => {
  const { baseUrl } = useConfig()
  return (
    <AppWrapper
      baseUrl={baseUrl}
      dataStoreKey="dataStore/semis/values"
    >
      <Router />
    </AppWrapper>
  )
}

export default App