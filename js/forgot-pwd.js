
/**
 * Envia el codigo de validacion al correo electronico.
 */
function setEmailBtnSendCodeClick() {
    var r = core.transform2Json(core.form.getData('.forgotPwdBody'));

    core.showLoading();
    core.apiFunction('sendEmailOffline', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            $('.forgotPwdBtnSetCode', '.forgotPwdBody').prop('disabled', false);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        $('.forgotPwdBtnSetCode', '.forgotPwdBody').prop('disabled', false);
    });
}


/**
 * Realiza el cambio de la contraseña.
 */
function forgotPwdBtnSaveClick() {
    var r = core.transform2Json(core.form.getData('.forgotPwdBody'));

    core.showLoading();
    core.apiFunction('changePwdOffline', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            $('.forgotPwdBtnSave', '.forgotPwdBody').prop('disabled', false);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        forgotPwdBtnBackClick();
    });
}


/**
 * Regresa a la pantalla de login.
 */
function forgotPwdBtnBackClick() {
    core.loadHTML('.homeBodyWorkArea', './login.php');
}


/**
 * On Load.
 */
$(() => {
    core.linkNativeEvents('.forgotPwdBody');

    $('.forgotPwdBtnSetCode', '.forgotPwdBody').unbind('click');
    $('.forgotPwdBtnSetCode', '.forgotPwdBody').on('click', () => {
        $('.forgotPwdBtnSetCode', '.forgotPwdBody').prop('disabled', true);
        setEmailBtnSendCodeClick();
    });

    $('.forgotPwdBtnSave', '.forgotPwdBody').unbind('click');
    $('.forgotPwdBtnSave', '.forgotPwdBody').on('click', () => {
        $('.forgotPwdBtnSave', '.forgotPwdBody').prop('disabled', true);
        forgotPwdBtnSaveClick();
    });

    $('.forgotPwdBtnBack', '.forgotPwdBody').unbind('click');
    $('.forgotPwdBtnBack', '.forgotPwdBody').on('click', () => {
        forgotPwdBtnBackClick();
    });
});
