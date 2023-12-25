
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/change-email-02.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="changeEmail02Body">
    <div class="window">
        <div class="windowTitle">
            <h6>Validación de Correo Electrónico</h6>
        </div>
        <div class="windowBox">
            <fieldset>
                <legend>Instrucciones</legend>
                <p>
                    Se ha enviado a su correo electrónico un código de validación el cual debe
                    introducir a continuación para finalizar el proceso de cambio de EMail.
                </p>
            </fieldset>
            <div class="vsep10"></div>
            <fieldset>
                <legend>Código de Validación</legend>
                <div class="flex">
                    <div>
                        <span class="lbl">Introduzca el código:</span>
                    </div>
                    <div class="hsep5"></div>
                    <div>
                        <input type="text" class="txb" name="pinCode" maxlength="6" autocomplete="off">
                    </div>
                </div>
            </fieldset>
            <br>
            <div class="changeEmail02ButtonBox flex flex-right">
                <button class="btn btn-info changeEmail02BtnValidate">Validar</button>
                <div class="hsep10"></div>
                <button class="btn btn-dark changeEmail02BtnCancel">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/change-email-02.js'; ?>
</script>
