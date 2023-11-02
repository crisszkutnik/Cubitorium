# Probar Cubitorium desde otra máquina

Por si quieren probar esto desde alguna compu sin tener que instalar todo.
Prenden todo, arriba nomás CUBITORIUM. Puerto 5173 con el cliente y 8899 con el back.

Luego, se instalan [ngrok](https://ngrok.com/). Creás un archivo de config así:

```
version: "2"
authtoken: <tu_token>
tunnels:
  first:
    addr: 8899
    proto: http
  second:
    addr: 5173
    proto: http
```

Le pasás la URL que te entregue **ngrok** a tu amigo tester, y ya puede ver todo.

# No puedo escribir nada...

Para eso, tenés que decirle que configure Phantom para "localnet" y que haga _reverse-proxy_ de su `localhost:8899` al endpoint de **ngrok** para tu puerto `localhost:8899`.  
Eso es porque los ratones de Phantom no te dejan poner un custom RPC, si no con eso alcanzaría.

La forma más fácil es con [Caddy](https://caddyserver.com/docs/quick-starts/caddyfile).  
Se lo instala facilísimo, crea un archivo `Caddyfile` con esto: (creo?)

```
tu-endpoint-de-backend.com {
   reverse-proxy localhost:8899
}
```

Le manda un `caddy start`, y AHÍ se supone que con eso le andaría.

Es una alternativa más fácil a bajarse Solana Anchor etc etc etc. Qué se yo.
