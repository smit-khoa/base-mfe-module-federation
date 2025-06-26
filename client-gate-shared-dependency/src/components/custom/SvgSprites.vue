<template>
    <SvgSprite :symbol="symbol" :size="size" />
</template>
<script setup lang="ts">
import { SvgSprite } from "vue-svg-sprite"
interface Props {
    symbol: string
    size: string
}

const props = defineProps<Props>()

const symbol = props.symbol
const size = props.size
</script>
