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
> - `ionic cap sync` per reflectir la incorporació de nous plugins


- Components *stand-alone*.
- Autenticació (login/registre/recuperació i canvi de contrasenya/ canvi de email d'usuari)
- Perfil d'usuari amb un nom únic per usuari (gestionat amb Firebase)
- Hub de missatges que permet la comunicació entre components (*messageHub.service.ts*)
- Gestió centralitzada d'errors (*exceptionHandler.service.ts*): Mostra un Toast a l'usuari i comunica la situació pel hub de missatges (com a resultat, es mostra una icona d'error)

- `npm install ts-md5`
- `npm install @ionic/pwa-elements` (incorpora `defineCustomElements(window);` en main.ts)
- `npm install @capacitor/camera @capacitor/preferences @capacitor/filesystem` (els plugins de base de dades s'instal·len després)
- `npm install @capacitor/geolocation`
- `npm install @capacitor/app`
- `npm install @capacitor/browser`

### Firebase

- `ng add @angular/fire`

#### Authentication

Permet els serveis d'autentificació (login). Es fan servir els atributs disponibles: *displayName* i *photoURL*. A més, es gestiona la propietat *emailVerified* exigint als usuaris verificar l'email per accedir al sistema.

#### Firestore

Es fa servir per garantir un nom únic d'usuari (*displayName*) per a cada usuari.
Es programen acuradament les regles per no permetre altres usos il·legals de la base de dades Firebase (aplicació front-end).


