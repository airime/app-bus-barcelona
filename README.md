# app-bus-barcelona

Projecte del curs "***Desenvolupament d'aplicacions híbrides per a Android, iOS i PWA***" 2024.

Desenvolupat amb components *stand-alone*.

## Grup
- [airime](https://github.com/airime) Mireia Martin
- [S-Cesc](https://github.com/S-Cesc) Cesc Sasal

## Característiques

- `npm install -g @ionic/cli`
- `ionic cap add android`

> Per tant, fem servir les ordres:
> - `ionic cap copy` per reflectir els canvis en el codi.
> - `ionic cap sync android` per reflectir la incorporació de nous plugins


- Components *stand-alone*.
- Autenticació (login/registre/recuperació i canvi de contrasenya/ canvi de email d'usuari)
- Perfil d'usuari amb un nom únic per usuari (gestionat amb Firebase)
- Hub de missatges que permet la comunicació entre components (*messageHub.service.ts*)
- Gestió centralitzada d'errors (*exceptionHandler.service.ts*): Mostra un Toast a l'usuari i comunica la situació pel hub de missatges (com a resultat, es mostra una icona d'error)

- `npm install ts-md5`
- `npm install @ionic/pwa-elements` (also added `defineCustomElements(window);` in main.ts)
- `npm install @capacitor/push-notifications`
- `npm install @capacitor/camera @capacitor/preferences @capacitor/filesystem` (els plugins de base de dades s'instal·len després)
- NO! `npm install @capacitor/google-maps@next` (note de @next version, needed because version for capacitor 6 isn't ready yet)
  - Using --legacy-peer-deps didn't work `npm install @capacitor/google-maps --legacy-peer-deps`. Moreover, when using the option `--legacy-peer-deps`, it will be needed again each time `ionic cap sync` or `ionic cap copy` is done.

> Revisió de Google Maps
> `npm uninstall @capacitor/google-maps`
> S'afegeix la versió nativa
> ([veure documentació](https://developers.google.com/maps/documentation/javascript/examples/map-simple))
> 
> 1. `npm i -D @types/google.maps`
>
> 2. En `<head>` de `index.html` s'ha d'afegir `<script async>...</script>` referent a l'API de GMaps
> 
> 3. `/// <reference types="@types/google.maps" />` en el component que fa servir gMaps
>
> 4. Afegir l'import que es requereixi

- `npm install @googlemaps/markerclusterer`
- `npm install supercluster`
- `npm install @types/supercluster`
- `npm i --save-dev @types/supercluster @types/google.maps`
> Requereix canviar les opcions del compilador (tsconfig.json):
  ```
   "angularCompilerOptions": {
    ...
    "allowSyntheticDefaultImports": true
    ...
    }
  ```
- `npm install @capacitor/geolocation`

> - [TODO!] /* TODO */ Pendent permisos d'Android
> - **Pendent**: [Veure documentació de geolocalització](https://ionicframework.com/docs/native/geolocation)


- `npm install @capacitor/preferences`
- `npm install @capacitor/app`
- `npm install @capacitor/browser`
- [TMB API](https://developer.tmb.cat/) incorpora el seu id d'aplicació i una clau.
  - Veure [TMB samples](https://tmb-barcelona.github.io/TMB-API-samples/) (crides en javascript fent servir ajax)
- Icones [fontawesome](https://fontawesome.com/search?m=free&o=r):
  - index.html: `<script src="https://kit.fontawesome.com/e65ff45c32.js" crossorigin="anonymous"></script>`
  - example in-line: `<i class="fa-duotone fa-bus-alt" style="--fa-primary-color: orangered;"></i>`
  - [Ús en maps](https://developers.google.com/maps/documentation/javascript/examples/marker-modern):
    > `import { faBus } from "@fortawesome/free-solid-svg-icons";`
    ~~~  // use a FontAwesome svg
        new google.maps.Marker({
          position: { lat: 36.6163, lng: -100.61 },
          map,
          icon: {
            path: faBus.icon[4] as string,
            fillColor: "#0000ff",
            fillOpacity: 1,
            anchor: new google.maps.Point(
              faBus.icon[0] / 2, // width
              faBus.icon[1] // height
            ),
            strokeWeight: 1,
            strokeColor: "#ffffff",
            scale: 0.075,
          },
          title: "FontAwesome SVG Marker",
        });
    ~~~

### Firebase

- `ng add @angular/fire`

#### Authentication

Permet els serveis d'autentificació (login). Es fan servir els atributs disponibles: *displayName* i *photoURL*. A més, es gestiona la propietat *emailVerified* exigint als usuaris verificar l'email per accedir al sistema.

#### Firestore

Es fa servir per garantir un nom únic d'usuari (*displayName*) per a cada usuari.
Es programen acuradament les regles per no permetre altres usos il·legals de la base de dades Firebase (aplicació front-end).


