
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/set-email.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="setEmailBody">
    <!-- Cabecera. -->
    <div class="setEmailBodyHeader">
        <?php include __DIR__ . '/header.php'; ?>
    </div>

    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Establecer correo electrónico del usuario</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Establecer correo electrónico - Paso 1 de 2</legend>
                    <div>
                        <p>
                            Introduzca la dirección de correo electrónico que desea asociar a
                            su cuenta y haga click en el boton <b>Enviar Codigo de Validación</b>
                        </p>
                    </div>
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
                        <button class="btn btn-primary setEmailBtnSendCode">Enviar Codigo de Validación</button>
                    </div>
                </fieldset>
                <div class="vsep10"></div>
                <fieldset>
                    <legend>Establecer correo electrónico - Paso 2 de 2</legend>
                    <div>
                        <p>
                            Una vez reciba el código de seguridad en su correo electrónico
                            introduzcalo a continuación y haga click en el boton <b>Guardar</b>.
                        </p>
                    </div>
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
                </fieldset>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info setEmailBtnSave">Guardar Correo</button>
                    <div class="hsep10"></div>
                    <button class="btn btn-danger setEmailBtnCancel">Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/set-email.js'; ?>
</script>
