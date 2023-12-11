
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/cxc-detalle.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="cxcDetalleBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Detalle de la Transacción</h6>
        </div>
        <div class="windowBox">
            <fieldset>
                <legend>Empresa, Cliente y Moneda</legend>
                <div class="flex">
                    <div>
                        <div>
                            <span class="lbl">Empresa</span>
                        </div>
                        <div>
                            <input type="text" class="txb" name="idemp" hidden>
                            <input type="text" class="txb" name="nomemp" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Cliente</span>
                        </div>
                        <div>
                            <input type="text" class="txb" name="idcli" hidden>
                            <input type="text" class="txb" name="nomcli" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Moneda</span>
                        </div>
                        <div>
                            <input type="text" class="txb" name="idmon" hidden>
                            <input type="text" class="txb" name="siglas" disabled>
                            <input type="text" class="txb" name="nommon" hidden>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Tipo Transacción</span>
                        </div>
                        <div>
                            <input type="text" class="txb" name="tipo" hidden>
                            <input type="text" class="txb" name="tipoTexto" disabled>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div class="hsep10"></div>
                    <div>
                        <div>
                            <span class="lbl">Ver</span>
                        </div>
                        <select name="ver" class="txb">
                            <option value="0">Solo Pendientes</option>
                            <option value="1">Solo Pagados</option>
                            <option value="2">Pagados y Pendientes</option>
                        </select>
                    </div>
                </div>
            </fieldset>
            
            <div class="vsep10"></div>

            <fieldset>
                <legend>Transacciónes</legend>
                <div class="flex">
                    <div>
                        <div class="detalleGeneralClienteBox"></div>
                        <div class="flex flex-right">
                            <span class="lbl">Total CxC Cliente:</span>
                            <div class="hsep10"></div>
                            <input type="text" class="txb txb-num d2 m" name="totalCxCCliente" disabled>
                            <div class="space"></div>
                        </div>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <div class="spaceVert"></div>
                        <button class="btn btn-info mini-btn cxcDetalleBtnAddDocumento">
                            <span class="icon icon-plus"></span>
                        </button>
                        <div class="vsep5"></div>
                        <button class="btn btn-primary mini-btn cxcDetalleBtnEditDocumento">
                            <span class="icon icon-pencil"></span>
                        </button>
                        <div class="vsep5"></div>
                        <button class="btn btn-danger mini-btn cxcDetalleBtnDeleteDocumento">
                            <span class="icon icon-bin"></span>
                        </button>
                    </div>
                </div>
            </fieldset>

            <div class="vsep10"></div>

            <div class="flex">
                <fieldset>
                    <legend>Detalle de la Transacción</legend>
                    <div class="detalleDocBox"></div>
                </fieldset>
                <div class="hsep10"></div>
                <fieldset>
                    <legend>Abonos Realizados</legend>
                    <div class="flex">
                        <div>
                            <div class="detalleAbonosBox"></div>
                        </div>
                        <div class="hsep10"></div>
                        <div>
                            <div class="spaceVert"></div>
                            <button class="btn btn-info mini-btn cxcDetalleBtnAddAbono">
                                <span class="icon icon-plus"></span>
                            </button>
                            <div class="vsep5"></div>
                            <button class="btn btn-primary mini-btn cxcDetalleBtnEditAbono">
                                <span class="icon icon-pencil"></span>
                            </button>
                            <div class="vsep5"></div>
                            <button class="btn btn-danger mini-btn cxcDetalleBtnDeleteAbono">
                                <span class="icon icon-bin"></span>
                            </button>
                        </div>
                    </div>
                </fieldset>
            </div>
            <br>
            <div class="flex flex-right">
                <button class="btn btn-dark cxcDetalleBtnCerrar">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/cxc-detalle.js'; ?>
</script>
