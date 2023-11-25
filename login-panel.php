
<?php
    if (isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/login-panel.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="loginPanelBody">
    <div class="loginPanelBox">
        <!-- Icono. -->
        <div class="loginPanelIconBox">
            <div class="loginPanelIcon">
                <span class="icon icon-user"></span>
            </div>
        </div>

        <!-- Titulo. -->
        <div class="vsep10"></div>
        <div class="flex flex-hcenter">
            <h6>Acceso al Panel de Control</h6>
        </div>

        <div class="loginPanelControlsBox">
            <!-- Usuario. -->
            <div>
                <br>
                <div>
                    <span>Usuario</span>
                </div>
                <div>
                    <input type="text" class="txb txb-str-low" name="nickname" maxlength="20" autocomplete="off">
                </div>
            </div>

            <!-- Contraseña. -->
            <div>
                <br>
                <div>
                    <span>Contraseña</span>
                </div>
                <div>
                    <input type="password" class="txb" name="pwd" maxlength="20" autocomplete="off">
                </div>
                <div class="loginPanelForgotPwdBox">
                    <span>¿Olvidó su Contraseña?</span>
                </div>
            </div>
        </div>

        <!-- Botones. -->
        <br>
        <div class="loginPanelButtonsBox">
            <button class="btn btn-light">Ingresar</button>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/login-panel.js'; ?>
</script>
