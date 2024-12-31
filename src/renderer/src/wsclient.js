import Stomp from 'stompjs'
import { config } from '@/config'

class WebSocketClient {
  constructor() {
    this.client = undefined
    this.connected = false
  }

  connect(clientId) {
    this.client = Stomp.overWS(`ws://${config.BACKEND_URL}:${config.BACKEND_PORT}/online-users`)

    this.client.connect()
  }
  suscribeTo(topic) {
    if (!this.connected) return
    this.client.subscribe(topic, (message) => {})
  }
  sendTo(topic, message) {
    const m = this.client.send(topic, {}, message)
  }
}

const wsclient = new WebSocketClient()
export default wsclient
