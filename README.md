# Cubitorium | final-thesis | 2023

## Setup

1. Install Node >= 18, [NVM](https://github.com/nvm-sh/nvm) is recommended
2. Install [Yarn](https://yarnpkg.com/getting-started/install)
3. Install Rust, Solana and Anchor following [this guide](https://www.anchor-lang.com/docs/installation). Ignore `yarn` part as you already have it

### Test the setup

1. From `client/` run `yarn build`. Check that the compiled frontend shows in `client/dist`
2. From `backend/` run `yarn test`. Backend will compile to `backend/target` and tests will run
   - If you only want to compile run `yarn build`

## Running the app

We need to run a local validator, deploy the backend, and serve the frontend.

### Run the validator

In one terminal:

```shell
cd ~
solana config set --url localhost
solana-test-validator
```

### Deploy the backend

In another terminal:

```shell
cd backend
yarn build
anchor deploy
```

Alternatively, to compile, deploy, and load data all with one command:

```shell
cd backend
yarn init-backend
```

### Serve the frontend

In any terminal that's not running something:

```shell
cd client
yarn dev
```

Now open `localhost:5173` in your browser of preference.

## Authors

| Name               | Email                   | FRBA email                     |
| ------------------ | ----------------------- | ------------------------------ |
| Agustin Villareal  | agus@cpmail.com         | agustinvilla@frba.utn.edu.ar   |
| Cristobal Szkutnik | crisszkutnik@gmail.com  | cszkutnik@frba.utn.edu.ar      |
| Guido Dipietro     | dipietroguido@gmail.com | gdipietro@frba.utn.edu.ar      |
| Guido Enrique      | guidoenr4@gmail.com     | genriquezabala@frba.utn.edu.ar |
| Matias Davicino    | mati.spd@gmail.com      | mdavicino@frba.utn.edu.ar      |
