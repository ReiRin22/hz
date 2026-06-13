export interface StickyNote {
  id: string
  title: string
  content: string
  createdAt: string
  color: 'yellow' | 'blue' | 'pink' | 'green'
}

export interface TempDataItem {
  id: string
  patientName: string
  hoursAgo: string
  inputBy: string
  category: string
  detail: string
}

export interface MenuItem {
  id: string
  label: string
  description: string
  visible: boolean
}

export interface OrderItem {
  id: string
  label: string
  visible: boolean
}
