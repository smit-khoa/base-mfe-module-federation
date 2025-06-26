<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="outline"> Dropdown custom </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" side="bottom-start">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup v-model="position">
                <DropdownMenuRadioItem value="top"> Top </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom"> Bottom </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right"> Right </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script>
import * as DropdownMenu from "../ui/dropdown-menu"
import { Button } from "../ui/button"
export default {
    name: "Dropdown",
    components: {
        DropdownMenu: DropdownMenu.DropdownMenu,
        DropdownMenuTrigger: DropdownMenu.DropdownMenuTrigger,
        DropdownMenuContent: DropdownMenu.DropdownMenuContent,
        DropdownMenuItem: DropdownMenu.DropdownMenuItem,
        DropdownMenuSeparator: DropdownMenu.DropdownMenuSeparator,
        DropdownMenuRadioGroup: DropdownMenu.DropdownMenuRadioGroup,
        DropdownMenuRadioItem: DropdownMenu.DropdownMenuRadioItem,
        DropdownMenuLabel: DropdownMenu.DropdownMenuLabel,
        Button
    },
    data() {
        return {
            position: "bottom"
        }
    }
}
</script>

<style scoped></style>
