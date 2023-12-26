
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/forgot-pwd.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="forgotPwdBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Recuperar Contraseña</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Recuperar contraseña - Paso 1 de 2</legend>
                    <div>
                        <p>
                            A continuación introduzca la dirección de correo electrónico
                            asociada a su cuenta de usuario y posteriormente haga click
                            en el boton <b>Enviar Código</b>.
                        </p>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex flex-hcenter">
                        <div>
                            <div>
                                <span class="lbl">Correo Electrónico</span>
                            </div>
                            <div>
                                <input type="text" class="txb txb-str-low" name="email" maxlength="50" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="flex flex-hcenter">
                        <button class="btn btn-primary forgotPwdBtnSetCode">Enviar Código</button>
                    </div>
                </fieldset>
                <div class="vsep10"></div>
                <fieldset>
                    <legend>Recuperar contraseña - Paso 2 de 2</legend>
                    <div>
                        <p>
                            Coloque el código de seguridad que se envió a su correo y
                            escriba la nueva contraseña 2 veces para su verificación.
                        </p>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex flex-hcenter">
                        <div>
                            <div>
                                <span class="lbl">Código</span>
                            </div>
                            <div>
                                <input type="text" class="txb" name="pinCode" maxlength="6" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex flex-hcenter">
                        <div>
                            <div>
                                <span class="lbl">Contraseña</span>
                            </div>
                            <div>
                                <input type="password" class="txb" name="pwdNew" maxlength="20">
                            </div>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex flex-hcenter">
                        <div>
                            <div>
                                <span class="lbl">Verificación</span>
                            </div>
                            <div>
                                <input type="password" class="txb" name="pwdVerify" maxlength="20">
                            </div>
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info forgotPwdBtnSave">Guardar</button>
                    <div class="hsep10"></div>
                    <button class="btn btn-dark forgotPwdBtnBack">Atras</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/forgot-pwd.js'; ?>
</script>
