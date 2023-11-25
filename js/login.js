
/**
 * Acceso del usuario al sistema.
 */
function btnLoginClick() {
    let r = core.transform2Json(core.form.getData('.loginBox'));

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
 * On Load.
 */
$(() => {
    $('.btnLogin', '.loginBox').unbind('click');
    $('.btnLogin', '.loginBox').click(() => {
        btnLoginClick();
    });
});
