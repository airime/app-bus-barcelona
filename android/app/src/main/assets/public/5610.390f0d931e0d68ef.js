"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5610],{5610:(T,p,t)=>{t.r(p),t.d(p,{RecoveryPage:()=>b});var h=t(467),n=t(4341),u=t(6855),g=t(8397),v=t(9381),d=t(2752),f=t(5788),e=t(3953),R=t(3664),P=t(305),U=t(5601);function y(o,c){1&o&&e.nrm(0,"app-menu",0)}function D(o,c){if(1&o&&e.nrm(0,"app-header",2),2&o){const s=e.XpG();e.Y8G("title",s.title)}}function M(o,c){if(1&o&&(e.j41(0,"ion-item",9)(1,"span")(2,"small"),e.EFF(3,"Los emails son diferentes"),e.k0s()()()),2&o){const s=e.XpG(2);e.Y8G("hidden",s.emailGroupOk)}}function C(o,c){if(1&o&&(e.j41(0,"ion-item"),e.nrm(1,"ion-input",8),e.k0s(),e.DNE(2,M,4,1,"ion-item",9)),2&o){const s=e.XpG();e.R7$(),e.Y8G("readonly",s.wait),e.R7$(),e.vxM(s.emailGroupOk?-1:2)}}function O(o,c){1&o&&(e.j41(0,"ion-button",10),e.EFF(1,"Acceder"),e.k0s(),e.j41(2,"ion-button",11),e.EFF(3,"Registrarse"),e.k0s())}let b=(()=>{var o;class c{constructor(r,a,i,l){this.fb=r,this.authService=a,this.router=i,this.toastController=l,this.authService.refreshCurrentUser().then(m=>this.currentUser=m),this.wait=!1}get title(){return this.currentUser?"Cambiar la contrase\xf1a":"Restablecer la contrase\xf1a"}get loggedIn(){return!!this.currentUser}get userValidated(){var r,a;return null!==(r=null===(a=this.currentUser)||void 0===a?void 0:a.emailVerified)&&void 0!==r&&r}get email(){return this.credentials.controls.emailGroup.get("email")}get emailGroupOk(){if(this.currentUser)return console.log("emailGroupOk",!!this.currentUser),!0;{const r=this.credentials.controls.emailGroup;return console.log("emailOk:",!(null!=r&&r.hasError("areEqual"))),!(null!=r&&r.hasError("areEqual"))}}ngOnInit(){console.log("OnInit",this.currentUser);const r=this.currentUser?this.fb.group({email:["",[n.k0.required,n.k0.email]]}):this.fb.group({email:new n.MJ("",[n.k0.required,n.k0.email]),emailAgain:new n.MJ("",[n.k0.required,n.k0.email])},{validators:f.g6.areEqual});this.credentials=this.fb.group({emailGroup:r})}obrirCondicions(){const r=this.router.serializeUrl(this.router.createUrlTree(["service-terms"]));window.open(r,"_blank")}presentToast(r,a){var i=this;return(0,h.A)(function*(){const l=yield i.toastController.create({message:a,buttons:[{text:"Entendido",role:"cancel",handler:()=>{console.log("Toast error Cancel clicked")}}],position:r});l.onDidDismiss().then(E=>{console.log("Toast dismissed",E);const{role:F}=E;i.wait=!1;try{"cancel"==F&&(i.currentUser?i.authService.logout().then(()=>i.router.navigate(["login"])).catch(()=>{const _=new Error("Ha fallado la operaci\xf3n. Si todav\xeda se encuentra como usuario activo, por favor, use 'logout' para abandornar la aplicaci\xf3n.");throw _.name=d.Q8.AuthenticationError,_}):i.router.navigate(["login"]))}catch(_){throw(0,d.vd)(_)}}),yield l.present()})()}passwordRecovery(){var r=this;return(0,h.A)(function*(){if(r.wait=!0,!r.credentials.valid||r.currentUser&&r.currentUser.email!=r.email.value){r.wait=!1;const l=new Error("Error inesperado: Puede que no se cumplan las condiciones del formulario, o ha habido un error en el servicio.");throw l.name=d.Q8.FormError,l}r.authService.sendPasswordResetEmail(r.email.value).then(()=>{r.presentToast("middle","Se ha enviado un email con un enlace que permite restablecer la contrase\xf1a.\nRecuerde que debe incorporar al menos una may\xfascula, una min\xfasculas, un d\xedgito y un s\xedmbolo o espacio.")}).catch(l=>{r.wait=!1;const m=new Error((0,d.u1)(l));throw m.name=d.Q8.AuthenticationError,m}).finally(()=>r.wait=!1)})()}}return(o=c).\u0275fac=function(r){return new(r||o)(e.rXU(n.ok),e.rXU(R.u),e.rXU(P.Ix),e.rXU(U.K_))},o.\u0275cmp=e.VBU({type:o,selectors:[["app-recovery"]],standalone:!0,features:[e.aNF],decls:26,vars:8,consts:[["loggedIn","loggedIn","userValidated","userValidated"],["id","main-content",1,"ion-page"],[3,"title"],[3,"ngSubmit","formGroup"],["color","secondary"],["formGroupName","emailGroup"],["type","email","formControlName","email","label","E-Mail","fill","outline","errorText","email no es v\xe1lido","autocomplete","username","appAutofill",""],["fill","clear","type","submit",3,"disabled"],["type","email","formControlName","emailAgain","label","Repetir e-Mail","fill","outline","helperText","Debe introducir de nuevo el email","errorText","email no es v\xe1lido","autocomplete","email","appAutofill","",3,"readonly"],["color","danger",3,"hidden"],["fill","clear","href","login","color","primary"],["fill","clear","href","register","color","primary"]],template:function(r,a){1&r&&(e.DNE(0,y,1,0,"app-menu",0),e.j41(1,"main",1),e.DNE(2,D,1,1,"app-header",2),e.j41(3,"form",3),e.bIt("ngSubmit",function(){return a.passwordRecovery()}),e.j41(4,"ion-card",4)(5,"ion-card-header")(6,"ion-card-title")(7,"h2"),e.EFF(8),e.k0s()()(),e.j41(9,"ion-card-content")(10,"ion-list")(11,"ion-item-group",5)(12,"ion-item"),e.nrm(13,"ion-input",6),e.k0s(),e.DNE(14,C,3,2),e.k0s(),e.j41(15,"ion-item")(16,"p")(17,"span"),e.EFF(18,"Este formulario le enviar\xe1 un correo electr\xf3nico con un enlace que le permitir\xe1 establecer de nuevo la contrase\xf1a."),e.k0s(),e.j41(19,"span"),e.EFF(20,"\xa0"),e.j41(21,"small"),e.EFF(22,"Recuerde seguir las normes de esta aplicaci\xf3n para las contrase\xf1as: Puede usar una frase que tenga al menos una may\xfascula y un d\xedgito."),e.k0s()()()()()(),e.j41(23,"ion-button",7),e.EFF(24),e.k0s(),e.DNE(25,O,4,0),e.k0s()()()),2&r&&(e.vxM(a.userValidated?0:-1),e.R7$(2),e.vxM(a.loggedIn?2:-1),e.R7$(),e.Y8G("formGroup",a.credentials),e.R7$(5),e.JRh(a.currentUser?"Cambiar la contrase\xf1a":"Restablecer la contrase\xf1a"),e.R7$(6),e.vxM(a.currentUser?-1:14),e.R7$(9),e.Y8G("disabled",!a.credentials.valid||a.wait),e.R7$(),e.SpI(" ",a.currentUser?"Cambiar contrase\xf1a":"Restablecer contrase\xf1a"," "),e.R7$(),e.vxM(a.currentUser?-1:25))},dependencies:[g.Z,n.X1,n.qT,n.BC,n.cb,n.j4,n.JD,n.$R,v.l,u.b_,u.ME,u.tN,u.I9,u.nf,u.uz,u.$w,u.Jm]}),c})()}}]);