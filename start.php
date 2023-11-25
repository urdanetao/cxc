
<?php
    if (isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/start.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="inicioBody">

</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/start.js'; ?>
</script>
