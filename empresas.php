
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/empresas.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="empresasBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Busqueda Rápida</h6>
            </div>
            <div class="windowBox">
                <div class="empresasLastBox"></div>
            </div>
        </div>
    </div>
    <br>
    <div class="flex flex-hcenter">
        <div class="window empresasWindow">
            <div class="windowTitle">
                <h6>Empresas</h6>
            </div>
            <div class="windowBox">
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div>
                    <div>
                        <span class="lbl">Nombre</span>
                    </div>
                    <div class="flex">
                        <input type="text" class="txb txb-str enable-editing" name="nombre" maxlegth="30" autocomplete="off">
                        <div class="hsep5"></div>
                        <button class="btn btn-dark mini-btn btnEmpresasSearch">
                            <span class="icon icon-search"></span>
                        </button>
                    </div>
                </div>
                <br>
                <div class="empresasButtonBox flex flex-right">
                    <button class="btn btn-info mini-btn btnEmpresasAdd enable-noshow enable-showing">
                        <span class="icon icon-plus"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-primary mini-btn btnEmpresasEdit enable-showing">
                        <span class="icon icon-pencil"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-success mini-btn btnEmpresasSave enable-editing">
                        <span class="icon icon-floppy-disk"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-dark mini-btn btnEmpresasCancel enable-editing">
                        <span class="icon icon-cross"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-danger mini-btn btnEmpresasDelete enable-showing">
                        <span class="icon icon-bin"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/empresas.js'; ?>
</script>
