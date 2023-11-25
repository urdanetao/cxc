
<?php
    if (isset($_SESSION['user'])) {
        die();
    }
?>

<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/home.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="homeBody">
    <!-- Cabecera. -->
    <div class="homeBodyHeader">
        <?php include __DIR__ . '/header.php'; ?>
    </div>

    <!-- Cuerpo. -->
    <div class="homeBodyArea">
        <!-- Area del menu. -->
        <div class="homeBodyMenuArea"></div>

        <!-- Area de trabajo -->
        <div class="homeBodyWorkArea"></div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/home.js'; ?>
</script>
