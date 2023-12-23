
/**
 * Realiza el cambio de correo electronico.
 */
function changeEmailBtnChangeClick() {

}

/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.changeEmailBtnChange', currentArea).unbind('click');
    $('.changeEmailBtnChange', currentArea).on('click', () => {
        changeEmailBtnChangeClick();
    });
});
