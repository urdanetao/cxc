
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/login.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="loginBody">
    <div class="loginBox">
        <div class="window">
            <div class="windowTitle">
                <h6>Login</h6>
            </div>
            <div class="windowBox">
                <div class="loginLogoBox flex flex-hcenter">
                    <span class="icon icon-user"></span>
                </div>
                <div class="vsep10"></div>
                <div class="flex flex-hcenter">
                    <h5>Acceso al Sistema</h5>
                </div>
                <div class="vsep10"></div>
                <div class="flex flex-hcenter">
                    <div>
                        <div>
                            <span class="lbl">Usuario</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-str-low" name="nickname" maxlegth="20" autocomplete="off">
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
                            <input type="password" class="txb" name="pwd" maxlegth="20" autocomplete="off">
                        </div>
                        <div class="flex flex-right">
                            <div class="forgotPwdBox">
                                <span class="lbl lbl-link">¿Olvidó su Contraseña?</span>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div class="flex flex-hcenter">
                    <button class="btn btn-success btnLogin">Ingresar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/login.js'; ?>
</script>
