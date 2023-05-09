# Colighter Extension

Browser extension for colighter, currently only supports chromium browsers

## Development

Navigate to the root of this extension app, then run

- `yarn` to install dependencies
- `yarn build` to build the project
- configure `COLLAB_RELAY_URL` in **.env** file as necessary
- install the resulting build output in a chromium browser and test

> Note: If `COLLAB_RELAY_URL` is configured to `http://localhost:7070`,
> you should `run npm start:server` in a second shell

You can also refer to the [Development](../../README.md#development) guide at the root of the project
