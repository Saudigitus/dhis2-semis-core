const config = {
    type: 'app',
    i18n: {
        paths: [
            'src',
            'node_modules/dhis2-semis-attendance/src',
        ],
    },
    name: 'SEMIS',
    description: "SEMIS",

    entryPoints: {
        app: './src/app/app.tsx',
    },
    viteConfigExtensions: './viteConfigExtensions.mts',
    customAuthorities: ["SEMIS-CONFIGURATION", "SEMIS-DATA-VIEW", "SEMIS-DATA-ENTRY", "SEMIS-REPORTS", "SEMIS-STUDENT-MANAGEMENT", "SEMIS-STAFF-MANAGEMENT", "SEMIS-SYSTEM-ADMINISTRATION"],
}

module.exports = config
