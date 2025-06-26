<template>
    <div class="table">
        <Image symbol="icon-business" size="20" />
        <div class="table-header">
            <div class="table-header__left">
                <button class="table-header__btn table-header__btn--primary">
                    <img :src="image('add.svg')" alt="" />
                    Thêm thủ công
                </button>
                <button class="table-header__btn">
                    <img :src="image('list-bullet.svg')" alt="" />
                    Danh sách lữu trữ
                </button>
                <button class="table-header__btn">
                    <img :src="image('user-group.svg')" alt="" />
                    Chỉ định người
                </button>
                <button class="table-header__btn">
                    <img :src="image('add.svg')" alt="" />
                    Lưu trữ (3)
                </button>
            </div>
            <div class="table-header__right">
                <div class="table-header__avatars">
                    <div class="table-header__avatar">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face" alt="" />
                    </div>
                    <div class="table-header__avatar table-header__avatar--border">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face" alt="" />
                    </div>
                </div>
                <div class="table-header__actions">
                    <button class="table-header__btn table-header__btn--icon">
                        <img :src="image('refresh.svg')" alt="" />
                    </button>
                    <button class="table-header__btn">
                        <img :src="image('calendar.svg')" alt="" />
                        Tuần này
                    </button>
                    <button class="table-header__btn">
                        <img :src="image('layout-column.svg')" alt="" />
                        Tùy chỉnh cột
                    </button>
                    <button class="table-header__btn">
                        <img :src="image('filter.svg')" alt="" />
                        Bộ lọc
                    </button>
                    <button class="table-header__btn table-header__btn--primary">Chuyển stage (3)</button>
                </div>
            </div>
        </div>
        <div class="table-content">
            <!-- Nội dung bảng sẽ được thêm vào sau -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { SvgSprite } from "vue-svg-sprite"
const image = (file: string) => {
    return require(`../../assets/images/table/${file}`)
}

import Image from "./SvgSprites.vue"
</script>

<style lang="scss">
.table {
    width: 100%;
    height: 100%;
}

.table-header {
    @apply flex justify-between items-center p-4 border-b border-gray-200 bg-white;
    gap: 12px;

    &__left {
        @apply flex items-center;
        gap: 8px;
    }

    &__right {
        @apply flex items-center;
        gap: 20px;
    }

    &__avatars {
        @apply flex items-center;
        gap: -8px;
    }

    &__avatar {
        @apply w-9 h-9 rounded-full overflow-hidden bg-gray-100;

        &--border {
            @apply border border-white;
        }

        img {
            @apply w-full h-full object-cover;
        }
    }

    &__actions {
        @apply flex items-center;
        gap: 8px;
    }

    &__btn {
        @apply flex items-center bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
        gap: 6px;
        box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);

        &--primary {
            @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
        }

        &--icon {
            @apply px-3.5 justify-center;
            width: 40px;
        }

        img {
            @apply w-5 h-5;
        }
    }
}
</style>
