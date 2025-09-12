const config = {
    type: 'app',
    name: 'SEMIS',
    description: "SEMIS",

    entryPoints: {
        app: './src/app/app.tsx',
    },

    customAuthorities: ["SEMIS-CONFIGURATION", "SEMIS-DATA-VIEW", "SEMIS-DATA-ENTRY", "SEMIS-REPORTS", "SEMIS-STUDENT-MANAGEMENT", "SEMIS-STAFF-MANAGEMENT", "SEMIS-SYSTEM-ADMINISTRATION"],
}

module.exports = config
