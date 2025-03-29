<script setup>
import { onMounted } from 'vue'
import { ctrl, Controller } from '@tsei/ctrl/src/vue3'
onMounted(() => ctrl(document.head, 'head').sub())
</script>

<template>
        <Controller />
</template>
