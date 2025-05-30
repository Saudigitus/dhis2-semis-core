import Router from "../router/router"
import { useConfig } from "@dhis2/app-runtime"
import { AppWrapper } from "dhis2-semis-components"
import InitializeWrapper from "../components/wrapper/InitializeWrapper"

const App = () => {
  const { baseUrl } = useConfig()
  return (
    <AppWrapper
      baseUrl={baseUrl}
      dataStoreKey="dataStore/semis/values"
    >
      <InitializeWrapper>
        <Router />
      </InitializeWrapper>
    </AppWrapper>
  )
}

export default App