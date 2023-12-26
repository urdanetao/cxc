<?php
    if (!isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/change-tmp-pwd.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="changeTmpPwdBody">
    <!-- Cabecera. -->
    <div class="setEmailBodyHeader">
        <?php include __DIR__ . '/header.php'; ?>
    </div>

    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Cambiar contraseña temporal</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Cambio de contraseña obligatorio</legend>
                    <div>
                        <p>
                            Se ha detectado que su contraseña actual es temporal y sebe ser
                            cambiada, a continuación introduzca su nueva contraseña dos veces
                            para su verificación.
                        </p>
                    </div>
                    <div class="flex flex-hcenter">
                        <div>
                            <div>
                                <span class="lbl">Nueva Contraseña</span>
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
                    <button class="btn btn-info changeTmpPwdSave">Guardar Contraseña</button>
                    <div class="hsep10"></div>
                    <button class="btn btn-danger changeTmpPwdCancel">Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/change-tmp-pwd.js'; ?>
</script>
