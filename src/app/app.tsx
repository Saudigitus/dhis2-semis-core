import Router from "../router/router"
import { useConfig } from "@dhis2/app-runtime"
import { AppWrapper } from "dhis2-semis-components"
import InitializeWrapper from "../components/wrapper/InitializeWrapper"
import i18n from "../locales"

const App = () => {
  const { baseUrl } = useConfig()

  return (
    <>
      <AppWrapper
        baseUrl={baseUrl}
        i18n={i18n}
        dataStoreKey={"dataStore/semis/values"}
        schoolCalendarKey={"dataStore/semis/schoolCalendar"}
      >
        <InitializeWrapper>
          <Router />
        </InitializeWrapper>
      </AppWrapper>
    </>
  )
}

export default App