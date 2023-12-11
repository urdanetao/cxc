
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-documento.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addDocumentoBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar/Editar Documento</h6>
        </div>
        <div class="windowBox">
            <fieldset>
                <legend>Empresa, Cliente y Moneda</legend>
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
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
                </div>
            </fieldset>
            
            <div class="vsep10"></div>

            <fieldset class="datosBox">
                <legend>Datos del Documento</legend>
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
                            <span class="lbl">Tipo</span>
                        </div>
                        <div>
                            <select name="tipo" class="txb">
                                <option value="0">Seleccione</option>
                                <option value="1">Personal</option>
                                <option value="2">Comercial</option>
                            </select>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div class="vsep10"></div>

            <fieldset class="detalleBox">
                <legend>Detalle del documento</legend>
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div class="flex">
                    <div class="itemsBox"></div>
                    <div class="hsep5"></div>
                    <div>
                        <div class="spaceVert"></div>
                        <button class="btn btn-info mini-btn addDocumentoBtnAddItem">
                            <span class="icon icon-plus"></span>
                        </button>
                        <div class="vsep5"></div>
                        <button class="btn btn-primary mini-btn addDocumentoBtnEditItem">
                            <span class="icon icon-pencil"></span>
                        </button>
                        <div class="vsep5"></div>
                        <button class="btn btn-danger mini-btn addDocumentoBtnDeleteItem">
                            <span class="icon icon-bin"></span>
                        </button>
                    </div>
                </div>
                <div class="flex flex-right">
                    <div>
                        <span class="lbl">Total:</span>
                    </div>
                    <div class="hsep10"></div>
                    <div>
                        <input type="text" class="txb txb-num d2 m" name="total" disabled>
                    </div>
                    <div class="space"></div>
                </div>
            </fieldset>
            <br>
            <div class="flex flex-right">
                <button class="btn btn-info addDocumentoBtnSave">Guardar</button>
                <div class="hsep10"></div>
                <button class="btn btn-dark addDocumentoBtnClose">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/add-documento.js'; ?>
</script>
