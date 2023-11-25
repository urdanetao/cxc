
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/monedas.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="monedasBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Busqueda Rápida</h6>
            </div>
            <div class="windowBox">
                <div class="monedasLastBox"></div>
            </div>
        </div>
    </div>
    <br>
    <div class="flex flex-hcenter">
        <div class="window monedasWindow">
            <div class="windowTitle">
                <h6>Monedas</h6>
            </div>
            <div class="windowBox">
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div>
                    <div>
                        <span class="lbl">Siglas</span>
                    </div>
                    <div class="flex">
                        <input type="text" class="txb txb-str enable-editing" name="siglas" maxlegth="3" autocomplete="off">
                        <div class="hsep5"></div>
                        <button class="btn btn-dark mini-btn btnMonedasSearch">
                            <span class="icon icon-search"></span>
                        </button>
                    </div>
                </div>
                <div class="vsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Nombre</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-str enable-editing" name="nombre" maxlegth="20" autocomplete="off">
                    </div>
                </div>
                <br>
                <div class="monedasButtonBox flex flex-right">
                    <button class="btn btn-info mini-btn btnMonedasAdd enable-noshow enable-showing">
                        <span class="icon icon-plus"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-primary mini-btn btnMonedasEdit enable-showing">
                        <span class="icon icon-pencil"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-success mini-btn btnMonedasSave enable-editing">
                        <span class="icon icon-floppy-disk"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-dark mini-btn btnMonedasCancel enable-editing">
                        <span class="icon icon-cross"></span>
                    </button>
                    <div class="hsep10"></div>
                    <button class="btn btn-danger mini-btn btnMonedasDelete enable-showing">
                        <span class="icon icon-bin"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/monedas.js'; ?>
</script>
