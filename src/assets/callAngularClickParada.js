function callAngularClickParada(codiParada) {
    window.angularComponentReference.zone.run(() => { window.angularComponentReference.loadAngularFunctionClickParada(codiParada); });
}
function callAngularClickParadaLinia(codiParada, codiLinia) {
    window.angularComponentReference.zone.run(() =>
        { window.angularComponentReference.loadAngularFunctionClickParadaLinia(codiParada, codiLinia, nomLinia); });
}