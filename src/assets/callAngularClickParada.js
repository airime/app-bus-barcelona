function callAngularClickParada(codiParada) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunctionClickParada(codiParada); });
}
function callAngularClickParadaLinia(codiParada, codiLinia, nomLinia, colorLinia) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickParadaLinia(codiParada, codiLinia, nomLinia, colorLinia); });
}
function callAngularClickInterc(lat, lng, toLat, toLng) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickInterc(lat, lng, toLat, toLng); });
}

function callAngularClickAjudaParada(nomParada, codiParada, fromLat, fromLng, lat, lng) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickAjudaParada(nomParada, codiParada, fromLat, fromLng, lat, lng); });
}