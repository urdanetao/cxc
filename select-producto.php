
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/select-producto.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="selectProductoBody">
    <div class="window">
        <div class="windowTitle">
            <h6>Seleccion de Producto</h6>
        </div>
        <div class="windowBox">
            <div class="productosBox"></div>
            <br>
            <div class="flex flex-right selectProductoButtonBox">
                <button class="btn btn-info selectProductoBtnSelect">Ok</button>
                <div class="hsep10"></div>
                <button class="btn btn-dark selectProductoBtnClose">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<!-- Codigo javascript. -->
<script>
    <?php include __DIR__ . '/js/select-producto.js'; ?>
</script>
