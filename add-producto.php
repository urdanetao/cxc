
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-producto.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addProductoBody">
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Agregar/Editar Item</h6>
            </div>
            <div class="windowBox">
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div class="flex">
                    <div>
                        <div>
                            <span class="lbl">Código</span>
                        </div>
                        <div class="flex">
                            <input type="text" class="txb txb-str" name="codigo" maxlength="20" autocomplete="off">
                            <div class="hsep5"></div>
                            <button class="btn btn-primary mini-btn addProductoBtnBuscarProducto">
                                <span class="icon icon-search"></span>
                            </button>
                        </div>
                    </div>
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
                    <div>
                        <div>
                            <span class="lbl">Precio</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-num d2 m" name="precio" autocomplete="off">
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Cantidad</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-num d2 m" name="cantidad" autocomplete="off">
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Total</span>
                        </div>
                        <div>
                            <input type="text" class="txb txb-num d2 m" name="monto" disabled>
                        </div>
                    </div>
                </div>
                <br>
                <div class="flex flex-right">
                    <button class="btn btn-info addProductoBtnOk">Ok</button>
                    <div class="hsep10"></div>
                    <button class="btn btn-dark addProductoBtnCancelar">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/add-producto.js'; ?>
</script>
