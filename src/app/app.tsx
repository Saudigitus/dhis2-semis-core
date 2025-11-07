import Router from "../router/router"
import { useConfig } from "@dhis2/app-runtime"
import { AppWrapper } from "dhis2-semis-components"
import InitializeWrapper from "../components/wrapper/InitializeWrapper"
import i18n from "../locales"
import { useEffect, useState } from "react"
import { useCacheData } from "dhis2-semis-functions"

const App = () => {
  const { baseUrl } = useConfig()
  const { initializeDB } = useCacheData();
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    const initAndSave = async () => {
      try {
        await initializeDB(); // Wait for DB to be fully ready
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('DB error:', error);
      } finally {
        setLoading(false); // Set loading to false after operations complete
      }
    };
    initAndSave();
  }, []); // Run only once on mount

  if (loading) {
    return <span>{('Loading...')}</span>;
  }

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