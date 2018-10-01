<template>
    <main>
        <MainHeader></MainHeader>
        <router-view></router-view>
    </main>
</template>

<script>
import MainHeader   from  './AdminMainHeader.vue'

export default {
    components: {
        MainHeader     : MainHeader,
    }
}
</script>

<style scoped>
</style>