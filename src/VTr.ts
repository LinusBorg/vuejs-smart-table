import { computed, defineComponent, h, inject, useAttrs, isVue2 } from 'vue-demi'
import { storeKey } from './VTable'

export default defineComponent({
  name: 'VTr',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  setup(props: any, { slots }) {
    const store = inject(storeKey)!
    const {class: attrsClass, style: attrsStyle, ...otherAttrs} = useAttrs();

    const isSelected = computed(() => store.state.selectedRows.find((it: any) => it === props.row))
    const rowClass = computed(() => isSelected.value ? store.state.selectedClass : '')
    const style = computed(() => ({ ...(store.state.selectOnClick ? { cursor: 'pointer' } : {}) }))

    const handleRowSelected = (event: Event) => {
      const source = event.target as HTMLElement
      if (source && source.tagName.toLowerCase() === 'td') {
        if (isSelected.value) {
          store.deselectRow(props.row)
        } else {
          store.selectRow(props.row)
        }
      }
    }

    return () => {
      return h('tr', {
        class: rowClass.value,
        style: style.value,
        ...(store.state.selectOnClick ? {
          ...(isVue2 ? {
            on: {
              click: handleRowSelected,
            },
          }: {
            onClick: handleRowSelected,
          }),
        }: {}),
        ...otherAttrs,
        },
        slots.default ? slots.default({
          isSelected: isSelected.value,
          toggle: () => isSelected.value ? store.deselectRow(props.row) : store.selectRow(props.row)
        }) : []
      )
    }
  }
})
