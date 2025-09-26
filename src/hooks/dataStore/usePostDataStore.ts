import { useShowAlerts } from "dhis2-semis-functions"
import { useDataEngine } from "@dhis2/app-runtime"
import { useState } from "react"

// const QUERY: any = {
//     resource: `dataStore/semis/values`,
//     type: "update",
//     data: ({ data }: any) => data,
//     params: {
//         importStrategy: 'CREATE_AND_UPDATE'
//     }
// }
const type: any = 'update'

export default function usePostDataStore({ keySpace }: { keySpace: any }) {
    const engine = useDataEngine()
    const [error, setError] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(false)
    const { show, hide } = useShowAlerts()

    const createDataStore = async ({ data }: { data: any }) => {
        setLoading(true)
        await engine.mutate(
            {
                resource: keySpace,
                type: type,
                data: data,
                params: {
                    importStrategy: 'CREATE_AND_UPDATE'
                }
            }, {
            onComplete: async () => {
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