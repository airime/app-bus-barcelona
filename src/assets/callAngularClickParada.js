function callAngularClickParada(codiParada) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunctionClickParada(codiParada); });
}
function callAngularClickParadaLinia(codiParada, codiLinia, nomLinia) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickParadaLinia(codiParada, codiLinia, nomLinia); });
}
function callAngularClickInterc(lat, lng, toLat, toLng) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickInterc(lat, lng, toLat, toLng); });
}