
/**
 * Envia el codigo de validacion al correo electronico.
 */
function setEmailBtnSendCodeClick() {
    var r = core.transform2Json(core.form.getData('.setEmailBody'));

    core.showLoading();
    core.apiFunction('sendEmail', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            $('.setEmailBtnSendCode', '.setEmailBody').prop('disabled', false);
            return;
        }

        $('.setEmailBtnSendCode', '.setEmailBody').prop('disabled', false);
        core.showMessage(response.message, 4, core.color.success);
    });
}

/**
 * Guarda el correo electronico del usuario.
 */
function setEmailBtnSaveClick() {
    var r = core.transform2Json(core.form.getData('.setEmailBody'));

    core.showLoading();
    core.apiFunction('changeEmail02', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            $('.setEmailBtnSave', '.setEmailBody').prop('disabled', false);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        window.location.href = './index.php';
    });
}


/**
 * Finaliza la sesion del usuario.
 */
function setEmailBtnCancelClick() {
    core.showConfirm({
        'icon': 'icon icon-lock',
        'title': 'Cerrar Sesión',
        'message': 'Se dispone a cerrar la sesión actual, ¿esta seguro?',
        'callbackOk': () => {
            core.showLoading();
            core.apiFunction('logout', {}, (response) => {
                core.hideLoading();
                core.showMessage(response.message, 2, core.color.success, () => {
                    window.location.href = './index.php';
                });
            });
        }
    });
}


/**
 * On Load.
 */
$(() => {
    core.linkNativeEvents('.setEmailBody');

    $('.setEmailBtnSendCode', '.setEmailBody').unbind('click');
    $('.setEmailBtnSendCode', '.setEmailBody').on('click', (e) => {
        $(e.currentTarget).prop('disabled', true);
        setEmailBtnSendCodeClick();
    });

    $('.setEmailBtnSave', '.setEmailBody').unbind('click');
    $('.setEmailBtnSave', '.setEmailBody').on('click', (e) => {
        $(e.currentTarget).prop('disabled', true);
        setEmailBtnSaveClick();
    });

    $('.setEmailBtnCancel', '.setEmailBody').unbind('click');
    $('.setEmailBtnCancel', '.setEmailBody').on('click', () => {
        setEmailBtnCancelClick();
    });
});
