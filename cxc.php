
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/cxc.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="cxcBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Cuentas por Cobrar</h6>
            </div>
            <div class="windowBox">
                <div>
                    <input type="text" class="txb" name="id" hidden>
                </div>
                <div class="flex">
                    <div>
                        <fieldset>
                            <legend>Empresa y Tipo de Transacción</legend>
                            <div class="flex">
                                <div>
                                    <div>
                                        <span class="lbl">Empresa</span>
                                    </div>
                                    <div>
                                        <select name="idemp" class="txb"></select>
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
                                            <option value="0">Todas</option>
                                            <option value="1">Personal</option>
                                            <option value="2">Comercial</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div class="vsep10"></div>
                        <fieldset>
                            <legend>Resumen General por Moneda</legend>
                            <div class="resumenMonedaBox"></div>
                        </fieldset>
                    </div>
                    <div class="hsep10"></div>
                    <div class="hsep10"></div>
                    <div>
                        <fieldset>
                            <legend>Filtrar por Cliente Específico</legend>
                            <div class="flex">
                                <div>
                                    <div>
                                        <span class="lbl">Cliente</span>
                                    </div>
                                    <div class="flex">
                                        <input type="text" class="txb" name="idcli" hidden>
                                        <input type="text" class="txb txb-str" name="nomcli" disabled>
                                        <div class="hsep5"></div>
                                        <button class="btn btn-info mini-btn cxcBtnBuscarCliente">
                                            <span class="icon icon-search"></span>
                                        </button>
                                        <div class="hsep5"></div>
                                        <button class="btn btn-danger mini-btn cxcBtnQuitarCliente">
                                            <span class="icon icon-cross"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div class="vsep10"></div>
                        <fieldset>
                            <legend>Resumen General por Cliente</legend>
                            <div class="resumenClienteBox"></div>
                            <div class="totalCxCBox flex flex-right">
                                <div>
                                    <span class="lbl">Total:</span>
                                </div>
                                <div class="hsep5"></div>
                                <div>
                                    <input type="text" class="txb txb-num d2 m" name="totalCxC">
                                </div>
                                <div class="space"></div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/cxc.js'; ?>
</script>
