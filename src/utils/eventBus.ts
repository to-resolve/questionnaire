import type { EventBus } from '@/types'
import mitt from 'mitt'
const emitter = mitt<EventBus>()
export default emitter
