/* eslint-disable no-console */
import { PureComponent } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"

export const ModalMask = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
`

class InnerModal extends PureComponent {
  constructor(props) {
    super(props)
    this.modalRoot = document.getElementById("modal_root")
    if (!this.modalRoot) {
      this.modalRoot = document.createElement("div")
      document.body.appendChild(this.modalRoot)
    }
    this.el = document.createElement("div")
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
    window.addEventListener("beforeunload", this.modalCleanup)
  }

  componentWillUnmount() {
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
      console.error(e)
    }
    window.removeEventListener("beforeunload", this.modalCleanup)
  }

  modalCleanup = () => {
    try {
      this.modalRoot.removeChild(this.el)
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props

    return ReactDOM.createPortal(children, this.el)
  }
}
export default InnerModal
