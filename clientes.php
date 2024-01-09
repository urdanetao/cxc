
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/clientes.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="clientesBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Busqueda Rápida</h6>
            </div>
            <div class="windowBox">
                <div class="clientesLastBox"></div>
            </div>
        </div>
    </div>
    <br>
    <div class="flex flex-hcenter">
        <div class="window empresasWindow">
            <div class="windowTitle">
                <h6>Clientes</h6>
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
                        <input type="text" class="txb txb-str enable-editing" name="nombre" maxlength="30" autocomplete="off">
                        <div class="hsep5"></div>
                        <button class="btn btn-dark mini-btn btnClientesSearch">
                            <span class="icon icon-search"></span>
                        </button>
                    </div>
                </div>
                <div class="vsep10"></div>
                <fieldset>
                    <legend>Opciones</legend>
                    <div class="flex flex-vcenter flex-space-between">
                        <div>
                            <span class="lbl">Cliente Especial (Socio)</span>
                        </div>
                        <div>
                            <label class="switch" for="espClientes">
                                <input type="checkbox" id="espClientes" class="txb enable-editing" name="esp">
                                <div class="slider round"></div>
                            </label>
                        </div>
                    </div>
                </fieldset>
                <br>
                <div class="clientesButtonBox flex flex-right">
                    <button class="btn btn-info mini-btn btnClientesAdd enable-noshow enable-showing">
                        <span class="icon icon-plus"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-primary mini-btn btnClientesEdit enable-showing">
                        <span class="icon icon-pencil"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-success mini-btn btnClientesSave enable-editing">
                        <span class="icon icon-floppy-disk"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-dark mini-btn btnClientesCancel enable-editing">
                        <span class="icon icon-cross"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-danger mini-btn btnClientesDelete enable-showing">
                        <span class="icon icon-bin"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/clientes.js'; ?>
</script>
