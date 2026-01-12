This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## How to run the application

> ⚠️ **Important note**
>
> This application is based on **Git Submodules**. After cloning the core repository, you must initialize and update the submodules for the project to work correctly.

### Initial steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Saudigitus/dhis2-emis-config
   ```

2. Navigate to the project directory:
   ```bash
   cd dhis2-emis-config
   ```

3. Initialize and update the submodules:
   ```bash
   git submodule update --init --recursive
   ```

4. Install dependencies:
   ```bash
   npm install -f
   ```

5. Start the application:
   ```bash
   npm run start
   ```

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `npm run build` for windows
### `npm run build-unix` for unix based systems

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `npm run deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `npm run build` before running `npm run deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
