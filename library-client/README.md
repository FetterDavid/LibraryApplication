## Kliens fejlesztői környezet

### Szükséges eszközök

- minimum NodeJS 20
- minimum NPM 10

### Dependency-k telepítése

A **"library-client"** mappán belül az `npm install` paranccsal lehet telepíteni a dependency-ket.
Ezt csak egyszer kell lefuttatni, ez bele rakja a szükséges dolgokat a **"node_modules"** mappába.
Abban az esetben, ha változnak a dependency-k, az `npm ci` paranccsal érdemes frissíteni őket (a 
**ci** a _clean install_-t jelenti, a sima _install_ paranncsal ellentétben, ez nem piszkál bele a
**package-lock.json**-be frissítéskor.).

### Futtatás

Futtatáshoz, az API origin-t meg kell adni a `REACT_APP_API_ORIGIN` környezeti változóba, például:

```shell
# Windows-on
set "REACT_APP_API_ORIGIN=localhost:7098" && npm run serve

# UNIX-os rendszereken
REACT_APP_API_ORIGIN=localhost:7098 npm run serve
```
