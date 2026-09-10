This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## How to run the application

> ⚠️ **Important note**
>
> This application is based on **Git Submodules**. After cloning the core repository, you must initialize and update the submodules for the project to work correctly.

### Initial steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Saudigitus/dhis2-semis-core
   ```

2. Navigate to the project directory:
   ```bash
   cd dhis2-semis-core
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

## Creating the Same Branch in All Submodules

Use `scripts/create-branch-all.sh` to create and publish a branch with the same
name in every configured module and shared library:

```bash
npm run branch:create -- <branch-name>
```

For example:

```bash
npm run branch:create -- feat/student-profile
```

The npm command works from Git Bash and PowerShell on Windows, as well as from
Linux and macOS terminals. It automatically uses Git Bash on Windows. You can
also run the script directly from Git Bash:

```bash
./scripts/create-branch-all.sh feat/student-profile
```

Before creating any branch, the script validates all submodules and their remote
repositories. It stops if a submodule is not initialized, contains local
changes, has a Git operation in progress, lacks write permission, already has a
conflicting branch, cannot reach `origin`, or cannot push to it.

Each new branch is pushed to `origin` and configured to track its remote branch.
If an unexpected error occurs after branch creation starts, the script removes
the local and remote branches it created and restores the affected submodules to
their previous branches or commits.

## Switching All Submodules to the Same Branch

Use `scripts/switch-branch-all.sh` to switch every configured module and shared library
to the same existing branch:

```bash
npm run branch:switch -- <branch-name>
```

For example:

```bash
npm run branch:switch -- develop
```

The target branch must exist locally or in the submodule's known `origin`
references. If a remote branch was created recently, fetch the submodules first:

```bash
git submodule foreach git fetch origin
```

The script validates every submodule before switching the first one. It stops
when it finds local changes, an unfinished Git operation, a missing branch, or
an uninitialized submodule. If an unexpected error occurs during the switch, it
restores the affected submodules to their previous branches or commits.

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
