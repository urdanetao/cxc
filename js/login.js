
/**
 * Acceso del usuario al sistema.
 */
function btnLoginClick() {
    let r = core.transform2Json(core.form.getData('.loginBody'));

    core.showLoading();
    core.apiFunction('login', r, (response) => {
        core.hideLoading();
        if (!response.status) {
            core.showMessage(response.message, 4, core.color.error);
            return;
        }
        core.showMessage(response.message, 2, core.color.success, () => {
            window.location.href = './index.php';
        });
    });
}


/**
 * Carga la pantalla de recuperacion de contraseña.
 */
function loginBodyBtnForgotPwdClick() {
    core.loadHTML('.homeBodyWorkArea', './forgot-pwd.php');
}

/**
 * On Load.
 */
$(() => {
    core.linkNativeEvents('.loginBody');

    $('.loginBodyBtnForgotPwd', '.loginBody').unbind('click');
    $('.loginBodyBtnForgotPwd', '.loginBody').click(() => {
        loginBodyBtnForgotPwdClick();
    });
    
    $('.btnLogin', '.loginBody').unbind('click');
    $('.btnLogin', '.loginBody').click(() => {
        btnLoginClick();
    });
});
