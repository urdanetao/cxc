
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/change-email-01.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="changeEmail01Body">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Cambio de Correo Electrónico</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Instrucciones</legend>
                    <p>
                        Introduzca su contraseña y la nueva dirección de correo electrónico que
                        desea establecer, se le enviará un código de validación al nuevo correo
                        que posteriormente será solicitado para validar el mismo.
                    </p>
                </fieldset>
                <div class="vsep10"></div>
                <fieldset>
                    <legend>Contraseña y nuevo correo electrónico</legend>
                    <div>
                        <div>
                            <span class="lbl">Contraseña Actual</span>
                        </div>
                        <div>
                            <input type="password" class="txb" name="pwd" maxlength="20" autocomplete="off">
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Nuevo Correo Electrónico</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-str-low" name="email" autocomplete="off">
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info changeEmail01BtnChange">Cambiar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo Javascript. -->
<script>
    <?php include __DIR__ . '/js/change-email-01.js'; ?>
</script>
