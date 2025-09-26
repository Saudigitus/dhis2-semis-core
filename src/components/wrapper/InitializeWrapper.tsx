import React, { useEffect } from 'react'
import { useProgramsKeys } from 'dhis2-semis-components'
import { RulesEngineWrapper, useUserInfo } from 'dhis2-semis-functions'
import { Center } from '@dhis2/ui'
import { CircularLoader } from '@dhis2/ui'

function InitializeWrapper({ children }: { children: React.ReactNode }) {
  const programs = useProgramsKeys()
  const { loading, userInfo } = useUserInfo()

  useEffect(() => {
    userInfo()
  }, [])

  if (loading) {
    return (
      <Center>
        <CircularLoader />
      </Center>
    )
  }

  return (
    <RulesEngineWrapper programs={[programs?.map((program) => program.id)?.join(',')]}>
      {children}
    </RulesEngineWrapper>
  )
}

export default InitializeWrapper