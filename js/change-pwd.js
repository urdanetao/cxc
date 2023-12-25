
/**
 * Realiza el cambio de contraseña.
 */
function changePwdBodyChangeClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));

    core.showLoading();
    core.apiFunction('changePwd', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        
        core.showMessage(response.message, 4, core.color.success);

        var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
        var r = core.transform2Json(core.form.getData(currentArea, true));
        core.form.setData(currentArea, r);
    });
}


/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.changePwdBodyChange', currentArea).unbind('click');
    $('.changePwdBodyChange', currentArea).on('click', () => {
        changePwdBodyChangeClick();
    });
});
