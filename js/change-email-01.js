
/**
 * Realiza el cambio de correo electronico.
 */
function changeEmail01BtnChangeClick() {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    var r = core.transform2Json(core.form.getData(currentArea));

    core.showLoading();
    core.apiFunction('changeEmail01', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.show('./change-email-02.php', {}, () => {
            var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
            var r = core.transform2Json(core.form.getData(currentArea, true));
            core.form.setData(currentArea, r);
        });
    });
}

/**
 * On Load.
 */
$(() => {
    var currentArea = core.tabs.getActiveTabArea('.engineBodyWorkArea');
    core.linkNativeEvents(currentArea);

    $('.changeEmail01BtnChange', currentArea).unbind('click');
    $('.changeEmail01BtnChange', currentArea).on('click', () => {
        changeEmail01BtnChangeClick();
    });
});
