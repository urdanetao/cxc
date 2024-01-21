
<?php
    if (!isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/rep-pagos-periodo.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="repPagosPeriodoBody">
    <br>
    <div class="flex flex-hcenter">
        <div class="window">
            <div class="windowTitle">
                <h6>Reporte de Pagos por Periodo</h6>
            </div>
            <div class="windowBox">
                <fieldset>
                    <legend>Periodo</legend>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Desde</span>
                            </div>
                            <div>
                                <input type="date" class="txb" name="desde">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Hasta</span>
                            </div>
                            <div>
                                <input type="date" class="txb" name="hasta">
                            </div>
                        </div>
                        <div class="hsep10"></div>
                        <div class="hsep10"></div>
                        <div>
                            <div>
                                <span class="lbl">Tipo Reporte</span>
                            </div>
                            <div>
                                <select class="txb" name="tipoReporte">
                                    <option value="1">Resumido</option>
                                    <option value="2">Detallado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <div class="vsep10"></div>
                <fieldset>
                    <legend>Filtros del Reporte</legend>
                    <div class="flex">
                        <div>
                            <div>
                                <span class="lbl">Empresa</span>
                            </div>
                            <div class="repPagosPeriodoEmpresaBox"></div>
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
                                <button class="btn btn-info mini-btn repPagosPeriodoBtnBuscarCliente">
                                    <span class="icon icon-search"></span>
                                </button>
                                <div class="hsep5"></div>
                                <button class="btn btn-danger mini-btn repPagosPeriodoBtnQuitarCliente">
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
                            <div class="repPagosPeriodoMonedaBox"></div>
                        </div>
                    </div>
                </fieldset>

                <div class="vsep10"></div>

                <fieldset>
                    <legend>Opciones</legend>
                    <div class="flex flex-vcenter flex-space-between">
                        <div>
                            <span class="lbl">Inluir clientes especiales</span>
                        </div>
                        <div>
                            <label class="switch" for="espRepPagosPeriodo">
                                <input type="checkbox" id="espRepPagosPeriodo" class="txb" name="esp">
                                <div class="slider round"></div>
                            </label>
                        </div>
                    </div>
                    <div class="vsep10"></div>
                    <div class="flex flex-vcenter flex-space-between">
                        <div>
                            <span class="lbl">Inluir documentos pagados</span>
                        </div>
                        <div>
                            <label class="switch" for="pagadosRepPagosPeriodo">
                                <input type="checkbox" id="pagadosRepPagosPeriodo" class="txb" name="pagados">
                                <div class="slider round"></div>
                            </label>
                        </div>
                    </div>
                </fieldset>
                
                <br>
                <div class="flex flex-right repPagosPeriodoButtonsBox">
                    <button class="btn btn-info repPagosPeriodoBtnPrint">Imprimir</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/rep-pagos-periodo.js'; ?>
</script>
