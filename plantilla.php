
<?php
    if (!isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="Body">

</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/.js'; ?>
</script>
