# Proyecto Final - 2023

## Setup

1. Instalar Node >= 18, recomiendo usar [NVM](https://github.com/nvm-sh/nvm)
2. Instalar [YARN](https://yarnpkg.com/getting-started/install)
3. Instalar Rust, Solana y Anchor siguiendo [esta guia](https://www.anchor-lang.com/docs/installation). Pueden ignorar la parte de YARN porque ya lo instalaron
4. Probar el setup
   - Parados sobre la carpeta `client` corran el comando `yarn build`. Se les tiene que compilar el front y el output va a estar en `client/dist`
   - Parados sobre la carpeta `backend`
     - Primero correr `yarn test`. Se tiene que compilar el programa de Rust cuya salida esta en `backend/target` y se tienen que correr los tests. Para solo compilar, hacer `yarn build`.
5. Correr la app
   - Parados sobre la carpeta `backend`, correr Solana localmente corriendo `solana-test-validator`
   - Tambien parados sobre `backend`, correr los siguientes comandos:
     ```
     solana config set --url localhost
     yarn build
     anchor deploy
     ```
     Se deberia hacer el deploy en tu instancia local de Solana
   - Sobre la carpeta `client` correr `yarn dev` e ir a la URL que salga en pantalla. Agregar la ruta `/test` y se deberia mostrar un boton para conectarse a una wallet (por ahora solo funciona con Phantom). Una vez conectado, hay dos campos para enviar informacion de usuario a Solana. Si se guarda correctamente, la misma se deberia mostrar en pantalla

## Contributors

| Name               | Email                   | FRBA email                     |
| ------------------ | ----------------------- | ------------------------------ |
| Agustin Villareal  | #                       | agustinvilla@frba.utn.edu.ar   |
| Cristobal Szkutnik | crisszkutnik@gmail.com  | cszkutnik@frba.utn.edu.ar      |
| Guido Dipietro     | dipietroguido@gmail.com | gdipietro@frba.utn.edu.ar      |
| Guido Enrique      | guidoenr4@gmail.com     | genriquezabala@frba.utn.edu.ar |
| Matias Davicino    | #                       | mdavicino@frba.utn.edu.ar      |
