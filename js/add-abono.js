
/**
 * Guarda un abono.
 */
function addAbonoBtnSaveClick() {
    var f = '#' + core.form.dialog.getCurrent();
    var r = core.transform2Json(core.form.getData(f));

    core.showLoading();
    core.apiFunction('abonosSave', r, (response) => {
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
    var params = core.data.restore(f, 'params');
    
    core.form.setData(f, params);
    core.linkNativeEvents(f);

    $('.addAbonoBtnSave', f).unbind('click');
    $('.addAbonoBtnSave', f).on('click', () => {
        addAbonoBtnSaveClick();
    })

    $('.addAbonoBtnClose', f).unbind('click');
    $('.addAbonoBtnClose', f).on('click', () => {
        core.form.dialog.close();
    })
});
