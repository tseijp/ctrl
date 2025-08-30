<script setup>
import { Controller } from '@tsei/ctrl/src/vue3'
import { CASES } from '../../docs/src/cases/index.ts'
import '@tsei/ctrl/style'

const cases = CASES
</script>

<template>
        <Controller>
                <div class="flex flex-col gap-4 max-w-[1024px]">
                        <component v-for="(Case, index) in cases" :key="index" :is="Case" />
                </div>
        </Controller>
</template>
