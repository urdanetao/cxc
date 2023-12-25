
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/change-pwd.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="changePwdBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Cambio de Contraseña</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Contraseña Actual</legend>
                    <div>
                        <p>
                            Introduzca su contraseña actual.
                        </p>
                    </div>
                    <div>
                        <div>
                            <span class="lbl">Contraseña</span>
                        </div>
                        <div>
                            <input type="password" class="txb" name="pwd">
                        </div>
                    </div>
                </fieldset>
                <br>
                <fieldset>
                    <legend>Nueva Contraseña</legend>
                    <div>
                        <p>
                            Introduzca la nueva contraseña 2 veces para su verificación.
                        </p>
                    </div>
                    <div>
                        <div>
                            <span class="lbl">Nueva Contraseña</span>
                        </div>
                        <div>
                            <input type="password" class="txb" name="pwdNew">
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Verificar Contraseña</span>
                        </div>
                        <div>
                            <input type="password" class="txb" name="pwdVerify">
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info changePwdBodyChange">Cambiar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo Javascript. -->
<script>
    <?php include __DIR__ . '/js/change-pwd.js'; ?>
</script>
