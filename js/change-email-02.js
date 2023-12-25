
/**
 * Valida el pin de seguridad y establece el nuevo mail.
 */
function changeEmail02BtnValidateClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    core.showLoading();
    core.apiFunction('changeEmail02', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        core.form.dialog.close();
    });
}

/**
 * On Load.
 */
$(() => {
    var f = '#' + core.form.dialog.getCurrent();
    core.linkNativeEvents(f);

    $('.changeEmail02BtnValidate', f).unbind('click');
    $('.changeEmail02BtnValidate', f).on('click', () => {
        changeEmail02BtnValidateClick();
    });

    $('.changeEmail02BtnCancel', f).unbind('click');
    $('.changeEmail02BtnCancel', f).on('click', () => {
        core.form.dialog.close();
    });
});
