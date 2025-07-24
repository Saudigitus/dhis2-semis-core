import { useShowAlerts } from "dhis2-semis-functions"
import { useDataEngine } from "@dhis2/app-runtime"
import { useState } from "react"
import { useDataStore } from "dhis2-semis-components"

const QUERY: any = {
    resource: `dataStore/semis/values`,
    type: "update",
    data: ({ data }: any) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE'
    }
}

export default function usePostDataStore() {
    const engine = useDataEngine()
    const [error, setError] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(false)
    const { show, hide } = useShowAlerts()
    const { error: errorInGet, getDataStore } = useDataStore({ keySpace: 'dataStore/semis/values', setLoading })

    const createDataStore = async ({ data }: { data: any }) => {
        setLoading(true)
        await engine.mutate(QUERY, {
            variables: {
                data
            },
            onComplete: async () => {
                await getDataStore(false)
                show({ message: "Configuration updated successfully!", type: { success: true } })
            },
            onError: () => {
                setError(true)
                setLoading(false)
                show({
                    message: `Could not update configuration`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }
        })
    }
    return { createDataStore, loading, error }
}