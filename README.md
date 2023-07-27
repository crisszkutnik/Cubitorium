# Proyecto Final - 2023


## Setup

1. Instalar Node >= 18, recomiendo usar [NVM](https://github.com/nvm-sh/nvm)
2. Instalar [YARN](https://yarnpkg.com/getting-started/install)
3. Instalar Rust, Solana y Anchor siguiendo [esta guia](https://www.anchor-lang.com/docs/installation). Pueden ignorar la parte de YARN porque ya lo instalaron
4. Probar el setup 
    - Parados sobre la carpeta `client` corran el comando `yarn build`. Se les tiene que compilar el front y el output va a estar en `client/dist`
    - Parados sobre la carpeta `backend`
      - Primero correr `anchor build`. Se tiene que compilar el programa de Rust cuya salida esta en `backend/target`.
      - Despues correr `anchor test` y bueno, se tienen que correr los tests

### Nota para los que usen VSCode

La version nueva de YARN funciona diferente a las anteriores. Si tienen problemas para resolver los modulos cuando abren un archivo, hagan alguna de estas cosas.

- Asegurense que no estan abriendo la carpeta root, sino la del modulo en particular. Es decir, no abran la carpeta `final-thesis` con VSCode, sino que tienen que abrir `client` y `backend` por separado. Si quieren tener las dos van a necesitar dos ventanas. Esto se podria arreglar creando un workspace pero creo que es bastante laburo y no se si vale la pena.
- Agregado a lo anterior, seguir [esta guia](https://yarnpkg.com/getting-started/editor-sdks#editor-setup) que explica como configurar VSCode con YARN
  
## Contributors

| Name               | Email                     | FRBA email                   |
|--------------------|---------------------------|------------------------------|
| Agustin Villareal  | #                         | agustinvilla@frba.utn.edu.ar |
| Cristobal Szkutnik | crisszkutnik@gmail.com    | cszkutnik@frba.utn.edu.ar    |
| Guido Dipietro     | dipietroguido@gmail.com   | gdipietro@frba.utn.edu.ar    |
| Guido Enrique      | guidoenr4@gmail.com       | genriquezabala@frba.utn.edu.ar |
| Matias Davicino    | #                         | mdavicino@frba.utn.edu.ar    |
