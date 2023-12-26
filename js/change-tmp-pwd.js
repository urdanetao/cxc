
/**
 * Guarda la nueva contraseña.
 */
function changeTmpPwdSaveClick() {
    var r = core.transform2Json(core.form.getData('.changeTmpPwdBody'));

    core.showLoading();
    core.apiFunction('changeTmpPwd', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }

        core.showMessage(response.message, 4, core.color.success);
        window.location.href = './index.php';
    });
}


/**
 * Finaliza la sesion del usuario.
 */
function changeTmpPwdCancelClick() {
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
    core.linkNativeEvents('.changeTmpPwdBody');

    $('.changeTmpPwdSave', '.changeTmpPwdBody').unbind('click');
    $('.changeTmpPwdSave', '.changeTmpPwdBody').on('click', () => {
        changeTmpPwdSaveClick();
    });

    $('.changeTmpPwdCancel', '.changeTmpPwdBody').unbind('click');
    $('.changeTmpPwdCancel', '.changeTmpPwdBody').on('click', () => {
        changeTmpPwdCancelClick();
    });
});
