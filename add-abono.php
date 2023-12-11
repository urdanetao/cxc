
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-abono.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addAbono">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar/Editar Abono</h6>
        </div>
        <div class="windowBox">
            <div>
                <input type="text" class="txb" name="id" hidden>
                <input type="text" class="txb" name="idparent" hidden>
            </div>
            <div class="flex">
                <div>
                    <div>
                        <span class="lbl">Fecha</span>
                    </div>
                    <div>
                        <input type="date" class="txb" name="fecha">
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Descripción</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-str" name="descrip" maxlength="50" autocomplete="off">
                    </div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Monto</span>
                    </div>
                    <div>
                        <input type="text" class="txb txb-num d2 m" name="monto" autocomplete="off">
                    </div>
                </div>
            </div>
            <br>
            <div class="flex flex-right addAbonoButtonsBox">
                <button class="btn btn-info addAbonoBtnSave">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-dark addAbonoBtnClose">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/add-abono.js'; ?>
</script>
