import screenfull from "screenfull";
import {AbstractButton} from "./AbstractButton";
import * as State from "./states";



export class Enter360Button extends AbstractButton {
    constructor(sourceCanvas, options){
        super(sourceCanvas, "360", options);
        this.__setState(State.READY_TO_PRESENT);

        this.__onClick = this.__onClick.bind(this);
        this.__onChangeFullscreen = this.__onChangeFullscreen.bind(this);
        this.domElement.addEventListener("click", this.__onClick);
        console.log(screenfull.raw.fullscreenchange);
        document.addEventListener(screenfull.raw.fullscreenchange, this.__onChangeFullscreen);
    }

    /**
     * @private
     */
    __setState(state){
        if(state != this.state) {
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.button.setTitle("Enter 360");
                    this.button.setDescription("");

                    if(this.state == State.PRESENTING){
                        this.emit("exit");
                    }
                    break;
                case State.PRESENTING:
                    this.button.setTitle("Exit 360");
                    this.button.setDescription("");

                    this.emit("enter");
                    break;
                default:
                    this.emit("error", new Error("Unknown state " + state));
            }

            this.emit("change", state);
            this.state = state;
        }
    }

    __onChangeFullscreen(e){
        this.__setState(screenfull.isFullscreen ? State.PRESENTING : State.READY_TO_PRESENT);
    }

    __onClick(){
        if(this.state == State.READY_TO_PRESENT){
            this.enterFullscreen();
        } else if(this.state == State.PRESENTING){
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        if(screenfull.enabled){
            screenfull.request(this.sourceCanvas);
            this.__setState(State.PRESENTING);
            return true;
        }
        return false;
    };

    exitFullscreen() {
        if(screenfull.enabled && screenfull.isFullscreen){
            screenfull.exit();
            this.__setState(State.READY_TO_PRESENT);
            return true;
        }
        return false;
    };

    remove(){
        this.domElement.removeEventListener('click', this.__onClick);
        document.removeEventListener(screenfull.raw.fullscreenchanged, this.__onChangeFullscreen);
        super.remove();
    }

}
