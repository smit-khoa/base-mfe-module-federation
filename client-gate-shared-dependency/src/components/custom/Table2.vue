<template>
    <div class="table-container">
        <div class="table-header">
            <h2>Bảng Virtual - {{ tableRows.length }} dòng x {{ tableColumns.length }} cột</h2>
            <div class="stats">
                <span>Tổng số cell: {{ totalCells.toLocaleString() }}</span>
                <span>Virtual Scrolling: Enabled</span>
                <span>Column Resizing: Enabled</span>
                <span>Column Reordering: Enabled</span>
            </div>

            <!-- Color Condition Controls -->
            <div class="color-controls">
                <div class="control-group">
                    <label>Cột:</label>
                    <select v-model="colorCondition.columnIndex" class="control-select">
                        <option value="">-- Chọn cột --</option>
                        <option v-for="(col, index) in orderedColumns" :key="index" :value="index">{{ col.title }} ({{ index }})</option>
                    </select>
                </div>

                <div class="control-group">
                    <label>Điều kiện:</label>
                    <select v-model="colorCondition.operator" class="control-select">
                        <option value="equals">Bằng</option>
                        <option value="contains">Chứa</option>
                        <option value="startsWith">Bắt đầu với</option>
                        <option value="endsWith">Kết thúc với</option>
                        <option value="greater">Lớn hơn</option>
                        <option value="less">Nhỏ hơn</option>
                    </select>
                </div>

                <div class="control-group">
                    <label>Giá trị:</label>
                    <input v-model="colorCondition.value" type="text" placeholder="Nhập giá trị..." class="control-input" />
                </div>

                <div class="control-group">
                    <label>Màu nền:</label>
                    <input v-model="colorCondition.backgroundColor" type="color" class="control-color" />
                </div>

                <div class="control-group">
                    <label>Màu chữ:</label>
                    <input v-model="colorCondition.textColor" type="color" class="control-color" />
                </div>

                <div class="control-group">
                    <button @click="applyColorCondition" class="apply-btn">Áp dụng</button>
                    <button @click="clearColorConditions" class="clear-btn">Xóa tất cả</button>
                </div>
            </div>

            <!-- Active Conditions Display -->
            <div v-if="activeColorConditions.length > 0" class="active-conditions">
                <h4>Điều kiện đang áp dụng:</h4>
                <div class="condition-list">
                    <div
                        v-for="(condition, index) in activeColorConditions"
                        :key="index"
                        class="condition-item"
                        :style="{
                            backgroundColor: condition.backgroundColor,
                            color: condition.textColor
                        }">
                        <span>
                            {{ orderedColumns[condition.columnIndex]?.title }}
                            {{ getOperatorText(condition.operator) }}
                            "{{ condition.value }}"
                        </span>
                        <button @click="removeColorCondition(index)" class="remove-condition">×</button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="table-wrapper"
            ref="tableWrapper"
            :style="{
                height: `${containerHeight + 40}px`,
                overflow: 'auto',
                position: 'relative'
            }"
            @scroll="onScroll">
            <!-- Table Content Container -->
            <div
                class="table-content"
                :style="{
                    width: `${totalWidth}px`,
                    height: `${rowVirtualizer.getTotalSize() + 40}px`,
                    position: 'relative'
                }">
                <!-- Header với virtual column scrolling -->
                <div
                    class="table-header-row"
                    ref="headerRow"
                    :style="{
                        position: 'sticky',
                        top: '0px',
                        zIndex: 10,
                        width: `${totalWidth}px`
                    }">
                    <!-- Fixed Columns Group (bao gồm checkbox + fixed columns) -->
                    <div
                        v-if="isCheckbox || fixedColumns.length > 0"
                        class="fixed-columns-group"
                        :style="{
                            position: 'sticky',
                            left: '0px',
                            width: `${fixedColumnsWidth}px`,
                            height: '40px',
                            zIndex: 999,
                            display: 'flex'
                        }">
                        <!-- Checkbox Header -->
                        <div
                            v-if="isCheckbox"
                            class="header-cell checkbox-header-cell"
                            :style="{
                                position: 'relative',
                                width: '50px',
                                height: '40px'
                            }">
                            <div class="header-content">
                                <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" class="checkbox-input" />
                            </div>
                        </div>

                        <!-- Fixed Columns -->
                        <div
                            v-for="column in fixedColumns"
                            :key="`fixed-${column.originalIndex}`"
                            class="header-cell"
                            :style="{
                                position: 'relative',
                                width: `${getColumnWidth(orderedColumns.findIndex(c => c.originalIndex === column.originalIndex))}px`,
                                height: '40px'
                            }">
                            <div class="header-content">
                                <div class="drag-handle">⋮⋮</div>
                                <span class="header-text">{{ column.title }}</span>
                            </div>
                            <!-- Column Resizer -->
                            <div
                                class="column-resizer"
                                @mousedown="
                                    startResize(
                                        $event,
                                        orderedColumns.findIndex(c => c.originalIndex === column.originalIndex)
                                    )
                                "
                                @dblclick="autoResizeColumn(orderedColumns.findIndex(c => c.originalIndex === column.originalIndex))"
                                @dragstart.stop
                                @drag.stop></div>
                        </div>
                    </div>

                    <!-- Scrollable Columns -->
                    <div
                        v-for="virtualColumn in virtualColumns"
                        :key="virtualColumn.index"
                        class="header-cell"
                        v-show="!orderedColumns[virtualColumn.index].fixed"
                        :class="{
                            'header-dragging': isDraggingColumn && draggingColumnIndex === virtualColumn.index,
                            'header-drag-over': dragOverColumnIndex === virtualColumn.index
                        }"
                        :style="{
                            position: 'absolute',
                            left: `${getScrollableColumnStart(virtualColumn.index)}px`,
                            width: `${getColumnWidth(virtualColumn.index)}px`,
                            top: '0px',
                            height: '40px',
                            zIndex: 1
                        }"
                        draggable="true"
                        @dragstart="startColumnDrag($event, virtualColumn.index)"
                        @dragend="endColumnDrag"
                        @dragover="onColumnDragOver($event, virtualColumn.index)"
                        @dragleave="onColumnDragLeave"
                        @drop="onColumnDrop($event, virtualColumn.index)">
                        <div class="header-content">
                            <div class="drag-handle">⋮⋮</div>
                            <span class="header-text">{{ orderedColumns[virtualColumn.index].title }}</span>
                        </div>

                        <!-- Column Resizer -->
                        <div class="column-resizer" @mousedown="startResize($event, virtualColumn.index)" @dblclick="autoResizeColumn(virtualColumn.index)" @dragstart.stop @drag.stop></div>
                    </div>
                </div>

                <!-- Virtual Row Body -->
                <div
                    class="table-body"
                    ref="parentRef"
                    :style="{
                        position: 'relative',
                        top: '0',
                        width: `${totalWidth}px`,
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        zIndex: 1
                    }">
                    <!-- Render các rows hiển thị -->
                    <div
                        v-for="virtualRow in virtualRows"
                        :key="virtualRow.index"
                        class="table-row"
                        :class="{ 'row-selected': isRowSelected(virtualRow.index) }"
                        :style="{
                            position: 'absolute',
                            top: `${virtualRow.start}px`,
                            left: '0px',
                            height: `${rowHeight}px`,
                            width: `${totalWidth}px`
                        }">
                        <!-- Fixed Columns Group (bao gồm checkbox + fixed columns) -->
                        <div
                            v-if="isCheckbox || fixedColumns.length > 0"
                            class="fixed-columns-group"
                            :style="{
                                position: 'sticky',
                                left: '0px',
                                width: `${fixedColumnsWidth}px`,
                                height: `${rowHeight}px`,
                                zIndex: 998,
                                display: 'flex',
                                backgroundColor: 'white'
                            }">
                            <!-- Checkbox Cell -->
                            <div
                                v-if="isCheckbox"
                                class="table-cell checkbox-cell"
                                :style="{
                                    position: 'relative',
                                    width: '50px',
                                    height: `${rowHeight}px`,
                                    lineHeight: `${rowHeight}px`,
                                    borderBottom: '1px solid #e5e7eb'
                                }">
                                <input type="checkbox" :checked="isRowSelected(virtualRow.index)" @change="toggleRowSelection(virtualRow.index)" class="checkbox-input" />
                            </div>

                            <!-- Fixed Columns -->
                            <div
                                v-for="column in fixedColumns"
                                :key="`fixed-row-${virtualRow.index}-${column.originalIndex}`"
                                class="table-cell"
                                :style="{
                                    position: 'relative',
                                    width: `${getColumnWidth(orderedColumns.findIndex(c => c.originalIndex === column.originalIndex))}px`,
                                    height: `${rowHeight}px`,
                                    lineHeight: `${rowHeight}px`,
                                    borderBottom: '1px solid #e5e7eb'
                                }">
                                <!-- Slot cho fixed column content -->
                                <slot
                                    :name="`cell-${orderedColumns.findIndex(c => c.originalIndex === column.originalIndex)}`"
                                    :row="tableRows[virtualRow.index]"
                                    :column="column"
                                    :rowIndex="virtualRow.index"
                                    :columnIndex="orderedColumns.findIndex(c => c.originalIndex === column.originalIndex)"
                                    :value="
                                        getCellValue(
                                            virtualRow.index,
                                            orderedColumns.findIndex(c => c.originalIndex === column.originalIndex)
                                        )
                                    ">
                                    <!-- Default content nếu không có slot -->
                                    {{
                                        getCellValue(
                                            virtualRow.index,
                                            orderedColumns.findIndex(c => c.originalIndex === column.originalIndex)
                                        )
                                    }}
                                </slot>
                            </div>
                        </div>

                        <!-- Scrollable Columns -->
                        <div
                            v-for="virtualColumn in virtualColumns"
                            :key="`${virtualRow.index}-${virtualColumn.index}`"
                            class="table-cell"
                            v-show="!orderedColumns[virtualColumn.index].fixed"
                            :style="{
                                position: 'absolute',
                                left: `${getScrollableColumnStart(virtualColumn.index)}px`,
                                top: '0px',
                                width: `${getColumnWidth(virtualColumn.index)}px`,
                                height: `${rowHeight}px`,
                                lineHeight: `${rowHeight}px`,
                                zIndex: 1,
                                ...getCellStyle(virtualRow.index, virtualColumn.index)
                            }">
                            <!-- Slot cho custom content -->
                            <slot
                                :name="`cell-${virtualColumn.index}`"
                                :row="tableRows[virtualRow.index]"
                                :column="tableColumns[virtualColumn.index]"
                                :rowIndex="virtualRow.index"
                                :columnIndex="virtualColumn.index"
                                :value="getCellValue(virtualRow.index, virtualColumn.index)">
                                <!-- Default content nếu không có slot -->
                                {{ getCellValue(virtualRow.index, virtualColumn.index) }}
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Resize Guide Line -->
        <div
            v-if="isResizing"
            class="resize-guide-line"
            :style="{
                left: `${resizeGuidePosition}px`
            }"></div>

        <!-- Column Drag Preview -->
        <div
            v-if="isDraggingColumn"
            class="column-drag-preview"
            :style="{
                left: `${dragPreviewPosition.x}px`,
                top: `${dragPreviewPosition.y}px`,
                width: `${getColumnWidth(draggingColumnIndex)}px`
            }">
            {{ orderedColumns[draggingColumnIndex]?.title }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from "vue"
import { useVirtualizer } from "@tanstack/vue-virtual"

// Props
const props = defineProps({
    containerHeight: {
        type: Number,
        default: 600
    },
    // External data props
    columns: {
        type: Array,
        default: () => []
    },
    rows: {
        type: Array,
        default: () => []
    },
    // Backward compatibility props
    rowCount: {
        type: Number,
        default: 1000
    },
    columnCount: {
        type: Number,
        default: 500
    },
    // Thêm prop để định nghĩa columns với slot info
    columnConfig: {
        type: Array,
        default: () => []
    },
    // Checkbox selection prop
    isCheckbox: {
        type: Boolean,
        default: false
    }
})

// Constants
const rowHeight = 52
const defaultColumnWidth = 120
const minColumnWidth = 50
const maxColumnWidth = 500
const headerHeight = 40

// Refs
const parentRef = ref()
const tableWrapper = ref()
const headerRow = ref()

// Column Width State
const columnWidths = ref(new Map())

// Column Order State
const columnOrder = ref([])

// Resize State
const isResizing = ref(false)
const resizingColumnIndex = ref(-1)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)
const resizeGuidePosition = ref(0)

// Drag State
const isDraggingColumn = ref(false)
const draggingColumnIndex = ref(-1)
const dragOverColumnIndex = ref(-1)
const dragPreviewPosition = ref({ x: 0, y: 0 })

// Color Condition State
const colorCondition = ref({
    columnIndex: "",
    operator: "equals",
    value: "",
    backgroundColor: "#ffeb3b",
    textColor: "#000000"
})

const activeColorConditions = ref([])

// Selection State
const selectedRows = ref(new Set())
const isSelectAll = ref(false)

// Emit events
const emit = defineEmits(["selection-change"])

// Data initialization
const initializeData = () => {
    // Use external data if provided, otherwise generate fallback data
    if (props.columns.length > 0 && props.rows.length > 0) {
        // Use external data
        tableColumns.value = props.columns.map((col, index) => ({
            key: col.key || col.field || `col_${index}`,
            title: col.title || col.label || `Column ${index + 1}`,
            width: col.width || defaultColumnWidth,
            originalIndex: index,
            hasSlot: col.hasSlot || false,
            slotName: col.slotName || `cell-${index}`,
            fixed: col.fixed || false
        }))
        tableRows.value = props.rows
    } else {
        // Fallback to generated data
        tableColumns.value = generateColumns()
        tableRows.value = generateData()
    }

    // Initialize column widths
    tableColumns.value.forEach((col, index) => {
        columnWidths.value.set(index, col.width)
    })

    // Initialize column order
    columnOrder.value = Array.from({ length: tableColumns.value.length }, (_, i) => i)

    // console.log("🔄 Column order:", props.columns)
}

// Data generation for fallback
const generateData = () => {
    const data = []
    for (let i = 0; i < props.rowCount; i++) {
        const row = { id: i }
        for (let j = 0; j < props.columnCount; j++) {
            row[`col_${j}`] = `Cell ${i}-${j}`
        }
        data.push(row)
    }
    return data
}

const generateColumns = () => {
    const cols = []
    for (let i = 0; i < props.columnCount; i++) {
        // Sử dụng columnConfig nếu có, nếu không thì dùng config mặc định
        const configColumn = props.columnConfig.find(col => col.index === i)
        const width = configColumn?.width || defaultColumnWidth

        cols.push({
            key: `col_${i}`,
            title: configColumn?.title || `Cột ${i + 1}`,
            width: width,
            hasSlot: configColumn?.hasSlot || false,
            slotName: configColumn?.slotName || `cell-${i}`,
            originalIndex: i // Lưu index gốc để tracking
        })
    }
    return cols
}

// Reactive data
const tableColumns = ref([])
const tableRows = ref([])

// Initialize data
initializeData()

// Watch for props changes
watch(
    () => [props.columns, props.rows],
    () => {
        initializeData()
    },
    { deep: true }
)

// Computed - Columns theo thứ tự đã sắp xếp
const orderedColumns = computed(() => {
    return columnOrder.value.map(originalIndex => {
        const column = tableColumns.value.find(col => col.originalIndex === originalIndex)
        return column || tableColumns.value[originalIndex]
    })
})

// Computed - Tách fixed columns và scrollable columns
const fixedColumns = computed(() => {
    return orderedColumns.value.filter(col => col.fixed === true)
})

const scrollableColumns = computed(() => {
    return orderedColumns.value.filter(col => col.fixed !== true)
})

// Computed - Fixed columns width (bao gồm checkbox nếu có)
const fixedColumnsWidth = computed(() => {
    let width = 0

    // Add checkbox width if enabled
    if (props.isCheckbox) {
        width += 50
    }

    // Add fixed columns width
    width += fixedColumns.value.reduce((total, col) => {
        const originalIndex = col.originalIndex
        const displayIndex = orderedColumns.value.findIndex(c => c.originalIndex === originalIndex)
        return total + getColumnWidth(displayIndex)
    }, 0)

    return width
})

// Computed
const totalCells = computed(() => tableRows.value.length * orderedColumns.value.length)
const totalWidth = computed(() => {
    let width = 0
    // Add checkbox column width if enabled
    if (props.isCheckbox) {
        width += 50 // Checkbox column width
    }
    for (let i = 0; i < orderedColumns.value.length; i++) {
        width += getColumnWidth(i)
    }
    return width
})

// Checkbox computed properties
const selectedRowIds = computed(() => Array.from(selectedRows.value))
const isAllSelected = computed(() => {
    return tableRows.value.length > 0 && selectedRows.value.size === tableRows.value.length
})
const isIndeterminate = computed(() => {
    return selectedRows.value.size > 0 && selectedRows.value.size < tableRows.value.length
})

// Column Width Methods
const getColumnWidth = displayIndex => {
    const originalIndex = columnOrder.value[displayIndex]
    return columnWidths.value.get(originalIndex) || defaultColumnWidth
}

const getColumnStart = displayIndex => {
    let start = 0
    // Add checkbox column width if enabled
    if (props.isCheckbox) {
        start += 50
    }
    for (let i = 0; i < displayIndex; i++) {
        start += getColumnWidth(i)
    }
    return start
}

// New method to get fixed column start position
const getFixedColumnStart = displayIndex => {
    const column = orderedColumns.value[displayIndex]
    if (!column.fixed) {
        return getColumnStart(displayIndex)
    }

    if (column.fixed === "left") {
        // For left fixed columns, start after checkbox (if enabled)
        let start = props.isCheckbox ? 50 : 0

        // Add width of previous left fixed columns
        for (let i = 0; i < displayIndex; i++) {
            const prevColumn = orderedColumns.value[i]
            if (prevColumn.fixed === "left") {
                start += getColumnWidth(i)
            }
        }
        return start
    }

    if (column.fixed === "right") {
        // For right fixed columns, position from the right
        let rightStart = 0
        for (let i = displayIndex + 1; i < orderedColumns.value.length; i++) {
            const nextColumn = orderedColumns.value[i]
            if (nextColumn.fixed === "right") {
                rightStart += getColumnWidth(i)
            }
        }
        return `calc(100% - ${rightStart + getColumnWidth(displayIndex)}px)`
    }

    return getColumnStart(displayIndex)
}

// New method to get scrollable column start position
const getScrollableColumnStart = displayIndex => {
    // Start after fixed group (đã bao gồm checkbox + fixed columns)
    let start = fixedColumnsWidth.value

    // Add width of previous scrollable columns
    for (let i = 0; i < displayIndex; i++) {
        const column = orderedColumns.value[i]
        if (!column.fixed) {
            start += getColumnWidth(i)
        }
    }
    return start
}

const setColumnWidth = (displayIndex, width) => {
    const originalIndex = columnOrder.value[displayIndex]
    const clampedWidth = Math.max(minColumnWidth, Math.min(maxColumnWidth, width))
    columnWidths.value.set(originalIndex, clampedWidth)

    // Update column config
    const column = orderedColumns.value[displayIndex]
    if (column) {
        column.width = clampedWidth
    }
}

// Column Drag Methods
const startColumnDrag = (event, displayIndex) => {
    // Không cho phép drag khi đang resize
    if (isResizing.value) {
        event.preventDefault()
        return
    }

    isDraggingColumn.value = true
    draggingColumnIndex.value = displayIndex

    // Set drag data
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", displayIndex.toString())

    // Create custom drag image
    const dragImage = event.target.cloneNode(true)
    dragImage.style.opacity = "0.8"
    dragImage.style.transform = "rotate(2deg)"
    document.body.appendChild(dragImage)
    event.dataTransfer.setDragImage(dragImage, event.offsetX, event.offsetY)

    // Remove drag image after a short delay
    setTimeout(() => {
        if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage)
        }
    }, 0)

    // console.log(`🎯 Bắt đầu kéo cột ${displayIndex}`)
}

const endColumnDrag = () => {
    isDraggingColumn.value = false
    draggingColumnIndex.value = -1
    dragOverColumnIndex.value = -1

    // console.log("✅ Kết thúc kéo cột")
}

const onColumnDragOver = (event, displayIndex) => {
    if (!isDraggingColumn.value || draggingColumnIndex.value === displayIndex) {
        return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    dragOverColumnIndex.value = displayIndex
}

const onColumnDragLeave = () => {
    dragOverColumnIndex.value = -1
}

const onColumnDrop = (event, targetDisplayIndex) => {
    event.preventDefault()

    if (!isDraggingColumn.value) return

    const sourceDisplayIndex = draggingColumnIndex.value

    if (sourceDisplayIndex === targetDisplayIndex) {
        endColumnDrag()
        return
    }

    // Reorder columns
    const newOrder = [...columnOrder.value]
    const [movedColumn] = newOrder.splice(sourceDisplayIndex, 1)
    newOrder.splice(targetDisplayIndex, 0, movedColumn)

    columnOrder.value = newOrder

    // console.log(`🔄 Đã di chuyển cột từ vị trí ${sourceDisplayIndex} đến ${targetDisplayIndex}`)
    // console.log("📋 Thứ tự cột mới:", newOrder)

    // Update active color conditions với index mới
    updateColorConditionsAfterReorder(sourceDisplayIndex, targetDisplayIndex)

    endColumnDrag()
}

const updateColorConditionsAfterReorder = (fromIndex, toIndex) => {
    activeColorConditions.value.forEach(condition => {
        const oldDisplayIndex = condition.columnIndex
        let newDisplayIndex = oldDisplayIndex

        if (oldDisplayIndex === fromIndex) {
            newDisplayIndex = toIndex
        } else if (fromIndex < toIndex) {
            if (oldDisplayIndex > fromIndex && oldDisplayIndex <= toIndex) {
                newDisplayIndex = oldDisplayIndex - 1
            }
        } else {
            if (oldDisplayIndex >= toIndex && oldDisplayIndex < fromIndex) {
                newDisplayIndex = oldDisplayIndex + 1
            }
        }

        condition.columnIndex = newDisplayIndex
    })
}

// Resize Methods
const startResize = (event, displayIndex) => {
    event.preventDefault()
    event.stopPropagation()

    isResizing.value = true
    resizingColumnIndex.value = displayIndex
    resizeStartX.value = event.clientX
    resizeStartWidth.value = getColumnWidth(displayIndex)
    resizeGuidePosition.value = event.clientX

    document.addEventListener("mousemove", handleResize)
    document.addEventListener("mouseup", endResize)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    // console.log(`🎯 Bắt đầu resize cột ${displayIndex}`)
}

const handleResize = event => {
    if (!isResizing.value) return

    const deltaX = event.clientX - resizeStartX.value
    const newWidth = resizeStartWidth.value + deltaX

    resizeGuidePosition.value = event.clientX

    // Preview resize (optional - có thể comment để chỉ hiển thị guide line)
    setColumnWidth(resizingColumnIndex.value, newWidth)
}

const endResize = event => {
    if (!isResizing.value) return

    const deltaX = event.clientX - resizeStartX.value
    const newWidth = resizeStartWidth.value + deltaX

    setColumnWidth(resizingColumnIndex.value, newWidth)

    isResizing.value = false
    resizingColumnIndex.value = -1

    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("mouseup", endResize)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""

    // console.log(`✅ Đã resize cột ${resizingColumnIndex.value} thành ${newWidth}px`)
}

const autoResizeColumn = displayIndex => {
    // Auto-fit column width based on content (simplified version)
    const sampleSize = Math.min(100, tableRows.value.length)
    let maxWidth = orderedColumns.value[displayIndex].title.length * 8 + 32 // Header width

    for (let i = 0; i < sampleSize; i++) {
        const cellValue = getCellValue(i, displayIndex)
        const contentWidth = String(cellValue).length * 7 + 24 // Approximate width
        maxWidth = Math.max(maxWidth, contentWidth)
    }

    const autoWidth = Math.min(maxColumnWidth, Math.max(minColumnWidth, maxWidth))
    setColumnWidth(displayIndex, autoWidth)

    // console.log(`🔄 Auto-resize cột ${displayIndex} thành ${autoWidth}px`)
}

// Row Virtualizer
const rowVirtualizer = useVirtualizer(
    computed(() => ({
        count: tableRows.value.length,
        getScrollElement: () => tableWrapper.value,
        estimateSize: () => rowHeight,
        overscan: 5
    }))
)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())

// Column Virtualizer - Updated to use ordered columns
const columnVirtualizer = useVirtualizer(
    computed(() => ({
        count: orderedColumns.value.length,
        getScrollElement: () => tableWrapper.value,
        estimateSize: index => getColumnWidth(index),
        overscan: 5,
        horizontal: true
    }))
)

const virtualColumns = computed(() => columnVirtualizer.value.getVirtualItems())

// Methods
const getCellValue = (rowIndex, displayIndex) => {
    const row = tableRows.value[rowIndex]
    const originalIndex = columnOrder.value[displayIndex]
    const column = tableColumns.value.find(col => col.originalIndex === originalIndex)
    return row?.[column.key] || ""
}

// Color Condition Methods
const checkCondition = (value, operator, conditionValue) => {
    const val = String(value).toLowerCase()
    const condVal = String(conditionValue).toLowerCase()

    switch (operator) {
        case "equals":
            return val === condVal
        case "contains":
            return val.includes(condVal)
        case "startsWith":
            return val.startsWith(condVal)
        case "endsWith":
            return val.endsWith(condVal)
        case "greater":
            return parseFloat(value) > parseFloat(conditionValue)
        case "less":
            return parseFloat(value) < parseFloat(conditionValue)
        default:
            return false
    }
}

const getCellStyle = (rowIndex, displayIndex) => {
    const cellValue = getCellValue(rowIndex, displayIndex)

    for (const condition of activeColorConditions.value) {
        if (condition.columnIndex === displayIndex) {
            if (checkCondition(cellValue, condition.operator, condition.value)) {
                return {
                    backgroundColor: condition.backgroundColor,
                    color: condition.textColor
                }
            }
        }
    }

    return {}
}

const applyColorCondition = () => {
    if (colorCondition.value.columnIndex === "" || colorCondition.value.value === "") {
        alert("Vui lòng chọn cột và nhập giá trị!")
        return
    }

    const newCondition = {
        ...colorCondition.value,
        columnIndex: parseInt(colorCondition.value.columnIndex)
    }

    activeColorConditions.value.push(newCondition)

    // Reset form
    colorCondition.value = {
        columnIndex: "",
        operator: "equals",
        value: "",
        backgroundColor: "#ffeb3b",
        textColor: "#000000"
    }

    // console.log("✅ Đã thêm điều kiện tô màu:", newCondition)
}

const clearColorConditions = () => {
    activeColorConditions.value = []
    // console.log("🗑️ Đã xóa tất cả điều kiện tô màu")
}

const removeColorCondition = index => {
    activeColorConditions.value.splice(index, 1)
    // console.log("🗑️ Đã xóa điều kiện tô màu:", index)
}

const getOperatorText = operator => {
    const operatorMap = {
        equals: "bằng",
        contains: "chứa",
        startsWith: "bắt đầu với",
        endsWith: "kết thúc với",
        greater: "lớn hơn",
        less: "nhỏ hơn"
    }
    return operatorMap[operator] || operator
}

const onScroll = () => {
    // Scroll được handle bởi table wrapper, không cần sync thêm gì
    // Virtual scrolling sẽ tự động update
}

// Checkbox selection methods
const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedRows.value.clear()
    } else {
        selectedRows.value.clear()
        tableRows.value.forEach((row, index) => {
            selectedRows.value.add(index)
        })
    }
    emitSelectionChange()
}

const toggleRowSelection = rowIndex => {
    if (selectedRows.value.has(rowIndex)) {
        selectedRows.value.delete(rowIndex)
    } else {
        selectedRows.value.add(rowIndex)
    }
    emitSelectionChange()
}

const isRowSelected = rowIndex => {
    return selectedRows.value.has(rowIndex)
}

const emitSelectionChange = () => {
    const selectedRowsData = Array.from(selectedRows.value).map(index => ({
        index,
        data: tableRows.value[index]
    }))
    emit("selection-change", selectedRowsData)
}

const getCheckboxColumnStart = () => {
    return 0 // Checkbox column is always first
}

const getColumnsStartWithCheckbox = displayIndex => {
    let start = 0
    // Add checkbox column width if enabled
    if (props.isCheckbox) {
        start += 50
    }
    for (let i = 0; i < displayIndex; i++) {
        start += getColumnWidth(i)
    }
    return start
}

// Cleanup
onUnmounted(() => {
    if (isResizing.value) {
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", endResize)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
    }
})

// Performance monitoring
const startTime = ref(0)
const renderTime = ref(0)

onMounted(async () => {
    startTime.value = performance.now()

    await nextTick()

    renderTime.value = performance.now() - startTime.value

    // console.log(`🚀 Bảng đã render với ${tableRows.value.length} dòng và ${orderedColumns.value.length} cột`)
    // console.log(`⏱️ Thời gian render: ${renderTime.value.toFixed(2)}ms`)
    // console.log(`📊 Tổng số cells: ${totalCells.value.toLocaleString()}`)
    // console.log(`🔧 Virtual scrolling: Enabled`)
    // console.log(`📏 Column resizing: Enabled`)
    // console.log(`🔄 Column reordering: Enabled`)
})
</script>

<style scoped lang="scss">
// Variables
$primary-color: #3b82f6;
$secondary-color: #10b981;
$danger-color: #ef4444;
$border-color: #e5e7eb;
$background-light: #f9fafb;
$background-gray: #f3f4f6;
$text-primary: #1f2937;
$text-secondary: #374151;
$text-muted: #6b7280;

// Mixins
@mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

@mixin button-base {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background-color 0.2s ease;
}

.table-container {
    width: 100%;
    height: 100%;
    border: 1px solid $border-color;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    position: relative;
}

.table-header {
    padding: 16px;
    background: $background-light;
    border-bottom: 1px solid $border-color;

    h2 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
    }
}

.stats {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: $text-muted;
    margin-bottom: 16px;
}

/* Color Controls Styling */
.color-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: end;
    padding: 12px;
    background: $background-gray;
    border-radius: 6px;
    margin-bottom: 16px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
        font-size: 12px;
        font-weight: 500;
        color: $text-secondary;
    }
}

.control-select,
.control-input {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
    min-width: 120px;
}

.control-color {
    width: 40px;
    height: 28px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
}

.apply-btn {
    @include button-base;
    background-color: $secondary-color;
    color: white;

    &:hover {
        background-color: #059669;
    }
}

.clear-btn {
    @include button-base;
    background-color: $danger-color;
    color: white;

    &:hover {
        background-color: #dc2626;
    }
}

/* Active Conditions Styling */
.active-conditions {
    margin-top: 12px;

    h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: $text-secondary;
    }
}

.condition-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.condition-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.remove-condition {
    background: rgba(0, 0, 0, 0.2);
    color: inherit;
    border: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    cursor: pointer;
    font-size: 12px;
    @include flex-center;

    &:hover {
        background: rgba(0, 0, 0, 0.4);
    }
}

.table-wrapper {
    position: relative;
    border: 1px solid $border-color;
    border-radius: 8px;
    overflow: auto;
    background: white;

    // Scrollbar styling
    &::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 6px;

        &:hover {
            background: #a1a1a1;
        }
    }

    &::-webkit-scrollbar-corner {
        background: #f1f1f1;
    }
}

.table-content {
    position: relative;
    background: white;
}

.table-header-row {
    background: $background-gray;
    border-bottom: 2px solid #d1d5db;
    height: 40px;
}

.table-body {
    position: relative;
    background: white;
}

.table-row {
    border-bottom: 1px solid $border-color;

    &:nth-child(even) {
        background-color: $background-light;
    }

    &:hover {
        background-color: $background-gray;
    }
}

.table-cell {
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 13px;
    color: $text-secondary;
    border-right: 1px solid $border-color;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Prevent text selection during resize */
body.resizing {
    user-select: none;
    cursor: col-resize !important;
}

/* Header Cell Styling */
.header-cell {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: $text-secondary;
    background: $background-gray;
    border-right: 1px solid #d1d5db;
    box-sizing: border-box;
    padding: 0 8px;
    position: relative;
    cursor: move;
    // transition: all 0.2s ease;

    &[draggable="true"] {
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-1px);
        }
    }

    &:hover {
        background: #e5e7eb;
    }

    &.header-dragging {
        opacity: 0.5;
        transform: rotate(2deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000 !important;
    }

    &.header-drag-over {
        background: #dbeafe;
        border-left: 3px solid $primary-color;
    }

    &:active .drag-handle {
        cursor: grabbing;
    }
}

.header-content {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 6px;
}

.drag-handle {
    font-size: 12px;
    color: #9ca3af;
    cursor: grab;
    user-select: none;
    opacity: 0.6;

    &:hover {
        opacity: 1;
        color: #6b7280;
    }
}

.header-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
}

/* Column Resizer Styling */
.column-resizer {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: col-resize;
    background: transparent;
    z-index: 20;

    &:hover {
        background: $primary-color;
    }

    &:active {
        background: #2563eb;
    }
}

/* Resize Guide Line */
.resize-guide-line {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $primary-color;
    z-index: 1000;
    pointer-events: none;
    opacity: 0.8;
}

/* Column Drag Preview */
.column-drag-preview {
    position: fixed;
    height: 40px;
    background: $background-gray;
    border: 2px solid $primary-color;
    border-radius: 4px;
    @include flex-center;
    font-weight: 600;
    font-size: 14px;
    color: $text-secondary;
    z-index: 1001;
    pointer-events: none;
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Checkbox Styling */
.checkbox-header-cell {
    background: $background-gray;
    border-right: 1px solid #d1d5db;
    @include flex-center;

    .header-content {
        @include flex-center;
        width: 100%;
    }
}

.checkbox-cell {
    @include flex-center;
    background: inherit;
    border-right: 1px solid #d1d5db;

    &:hover {
        background-color: inherit;
    }

    /* Checkbox cell sẽ inherit background từ fixed-columns-group */
    .table-row:nth-child(even) & {
        background: inherit;
    }

    .table-row:hover & {
        background: inherit;
    }

    .row-selected & {
        background: inherit;
    }
}

.checkbox-input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: $primary-color;

    &:indeterminate {
        opacity: 0.8;
    }
}

/* Selected Row Styling */
.row-selected {
    background-color: #e1edff !important;

    &:hover {
        background-color: #e1edff !important;
    }

    .table-cell {
        background-color: transparent;
    }
}

/* Fixed Columns Group Styling */
.fixed-columns-group {
    background: white;
    border-right: 1px solid #d1d5db;

    .table-cell {
        border-right: 1px solid #d1d5db;

        &:last-child {
            border-right: none;
        }
    }

    /* Row state styling for fixed group - đồng bộ với table-row */
    .table-row:nth-child(even) & {
        background: $background-light;

        .table-cell {
            background: inherit;
        }
    }

    .table-row:hover & {
        background: $background-gray;

        .table-cell {
            background: inherit;
        }
    }

    .row-selected & {
        background: #e1edff !important;

        .table-cell {
            background: inherit;
        }

        /* Đảm bảo checkbox cell cũng có màu selected */
        .checkbox-cell {
            background: inherit;
        }
    }

    /* Hover effect cho selected row */
    .row-selected.table-row:hover & {
        background: #e1edff !important;

        .table-cell {
            background: inherit;
        }
    }
}
</style>
