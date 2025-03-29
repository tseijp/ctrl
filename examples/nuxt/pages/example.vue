<script setup>
import '@tsei/ctrl/style'
import { useCtrl } from '@tsei/ctrl/src/vue3'
const c = useCtrl({ hello: 'world' })
</script>

<template>
        {{ c.hello }}
</template>
