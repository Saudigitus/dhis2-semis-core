import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { useConfig } from '@dhis2/app-runtime'
import { HashRouter } from 'react-router-dom'
import { AppWrapper } from 'dhis2-semis-components'
import { D2I18n } from 'dhis2-semis-types'

const Enrollment = ({ i18n }: { i18n: D2I18n }) => {
    const { baseUrl } = useConfig()
    //This is test 4.0

    return (
        <Router i18n={i18n as unknown as any} />
    )
}

export default Enrollment