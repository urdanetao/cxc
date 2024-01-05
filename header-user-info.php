
<!-- Hoja de estilos. -->
<style>
    <?php include __DIR__ . '/css/header-user-info.css'; ?>
</style>

<!-- Cuerpo principal. -->
<div class="headerUserInfoBody">
    <div class="flex flex-vcenter">
        <div>
            <div class="flex flex-right">
                <div>
                    <span class="headerUserInfoName"><?php echo($_SESSION['user']['nombre']) ?></span>
                </div>
            </div>
            <div class="flex flex-right">
                <div>
                    <span class="headerUserInfoEmail"><?php echo($_SESSION['user']['email']) ?></span>
                </div>
            </div>
        </div>
        <div class="hsep5"></div>
        <div class="headerUserInfoIconBox flex flex-hcenter flex-vcenter">
            <span class="icon icon-user"></span>
        </div>
    </div>
</div>

<!-- Javascript. -->
<script>
    <?php include __DIR__ . '/js/header-user-info.js'; ?>
</script>
