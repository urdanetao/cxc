
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/add-transaction.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="addTransaction">
    <div class="window">
        <div class="windowTitle">
            <h6>Agregar Transacción</h6>
        </div>
        <div class="windowBox">
            <div>
                <div>
                    <span class="lbl">Empresa</span>
                </div>
                <div>
                    <input type="text" class="txb" name="idemp" hidden>
                    <input type="text" class="txb" name="nomemp" disabled>
                </div>
            </div>

            <div class="vsep10"></div>

            <div class="flex">
                <div>
                    <div>
                        <span class="lbl">Moneda</span>
                    </div>
                    <div class="addTransactionMonedaBox"></div>
                </div>
                <div class="hsep10"></div>
                <div class="hsep10"></div>
                <div>
                    <div>
                        <span class="lbl">Cliente</span>
                    </div>
                    <div class="flex">
                        <input type="text" class="txb" name="idcli" hidden>
                        <input type="text" class="txb txb-str" name="nomcli" disabled>
                        <div class="hsep5"></div>
                        <button class="btn btn-info mini-btn addTransactionBtnBuscarCliente">
                            <span class="icon icon-search"></span>
                        </button>
                    </div>
                </div>
            </div>
            <br>
            <div class="flex flex-right">
                <button class="btn btn-info addTransactionBtnAdd">Agregar</button>
                <div class="hsep10"></div>
                <button class="btn btn-dark addTransactionBtnClose">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Código javascript. -->
<script>
    <?php include __DIR__ . '/js/add-transaction.js'; ?>
</script>
