const config = {
    type: 'app',
    i18n: {
        paths: [
            'src',
            'node_modules/dhis2-semis-attendance/src',
        ],
    },
    name: 'SEMIS',
    title: 'SEMIS',
    description: 'School management on DHIS2: enrol learners and staff, take daily attendance, record marks, transfer between schools and promote at the end of the year. Needs the SEMIS metadata and the setup in Configurations.',
    author: {
        name: 'DHIS2 for Education Team',
    },
    minDHIS2Version: '2.41',

    entryPoints: {
        app: './src/app/app.tsx',
    },
    viteConfigExtensions: './viteConfigExtensions.mts',
    customAuthorities: ["SEMIS-CONFIGURATION", "SEMIS-DATA-VIEW", "SEMIS-DATA-ENTRY", "SEMIS-REPORTS", "SEMIS-STUDENT-MANAGEMENT", "SEMIS-STAFF-MANAGEMENT", "SEMIS-SYSTEM-ADMINISTRATION"],
}

module.exports = config
