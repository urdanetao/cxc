
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/rep-general-saldos.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="repGeneralSaldosBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Reporte General de Saldos</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Filtros del Reporte</legend>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Empresa</span>
                            </div>
                            <div class="repSaldoGeneralEmpresaBox"></div>
                        </div>
                        <div class="hsep10"></div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Tipo Trans.</span>
                            </div>
                            <div>
                                <select name="tipo" class="txb">
                                    <option value="0">Todas</option>
                                    <option value="1">Personales</option>
                                    <option value="2">Comerciales</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Cliente</span>
                            </div>
                            <div class="flex">
                                <input type="text" class="txb" name="idcli" hidden>
                                <input type="text" class="txb txb-str" name="nomcli" placeholder="Mostrar Todos los Clientes" disabled>
                                <div class="hsep5"></div>
                                <button class="btn btn-info mini-btn repGeneralSaldosBtnBuscarCliente">
                                    <span class="icon icon-search"></span>
                                </button>
                                <div class="hsep5"></div>
                                <button class="btn btn-danger mini-btn repGeneralSaldosBtnQuitarCliente">
                                    <span class="icon icon-cross"></span>
                                </button>
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Moneda</span>
                            </div>
                            <div class="repGeneralSaldosMonedaBox"></div>
                        </div>
                    </div>
                </fieldset>
                
                <br>
                <div class="flex flex-right repGeneralSaldosButtonsBox">
                    <button class="btn btn-info repGeneralSaldosBtnPrint">Imprimir</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/rep-general-saldos.js'; ?>
</script>
