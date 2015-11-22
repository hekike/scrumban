import { findDOMNode } from 'react-dom'

export const cardTarget = {
  hover (props, monitor, component) {
    const monitorItem = monitor.getItem()

    const dragIndex = {
      cardIdx: monitor.getItem().cardIdx,
      columnIdx: monitor.getItem().columnIdx
    }
    const hoverIndex = {
      cardIdx: props.cardIdx,
      columnIdx: props.columnIdx
    }

    // Don't replace items with themselves
    if (monitorItem.id === props.id) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex.cardIdx < hoverIndex.cardIdx && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex.cardIdx > hoverIndex.cardIdx && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().columnIdx = hoverIndex.columnIdx
    monitor.getItem().cardIdx = hoverIndex.cardIdx
  }
}

export const cardSource = {
  beginDrag (props) {
    return {
      id: props.id,
      columnIdx: props.columnIdx,
      cardIdx: props.cardIdx
    }
  },
  isDragging (props, monitor) {
    return props.id === monitor.getItem().id
  },
  endDrag (props, monitor) {
    const monitorItem = monitor.getItem()
    const { orderCard, findColumnByIdx } = props

    const sourceColumn = findColumnByIdx(monitorItem.originalColumnIdx)
    const targetColumn = findColumnByIdx(monitorItem.columnIdx)

    orderCard({
      sourceColumnId: sourceColumn ? sourceColumn.get('id') : null,
      sourceColumn: monitorItem.originalColumnIdx,
      targetColumnId: targetColumn ? targetColumn.get('id') : null,
      targetColumn: monitorItem.columnIdx,
      sourceCard: monitorItem.originalCardIdx,
      targetCard: monitorItem.cardIdx
    })
  }
}
