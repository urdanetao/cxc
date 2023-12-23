
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/change-email.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="changeEmailBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Cambio de Correo Electrónico</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Ingrese el nuevo correo y su contraseña actual</legend>
                    <div>
                        <div>
                            <span class="lbl">Nuevo Correo Electrónico</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-low" name="email" autocomplete="off">
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Contraseña Actual</span>
                        </div>
                        <div>
                            <input type="password" class="txb" name="pwd" maxlength="20" autocomplete="off">
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info changeEmailBtnChange">Cambiar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo Javascript. -->
<script>
    <?php include __DIR__ . '/js/change-email.js'; ?>
</script>
