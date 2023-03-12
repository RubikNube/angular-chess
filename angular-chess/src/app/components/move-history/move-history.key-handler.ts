import { MoveHistoryComponent } from "./move-history.component";

/**
 * listen to key events and handles them
 * 
 * Supported keys:
 * - ArrowUp: move to start of move history
 * - ArrowLeft: move to previous move
 * - ArrowRight: move to next move
 * - ArrowDown: move to end of move history
 */
export class MoveHistoryKeyHandler {
    constructor(private moveHistoryComponent: MoveHistoryComponent) {
        // subscribe to key events
        document.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeydown(event));
    }

    public handleKeydown(event: KeyboardEvent): void {
        if (event.key === "ArrowUp") {
            this.moveHistoryComponent.moveToStart();
        } else if (event.key === "ArrowLeft") {
            this.moveHistoryComponent.moveBack();
        } else if (event.key === "ArrowRight") {
            this.moveHistoryComponent.moveForward();
        } else if (event.key === "ArrowDown") {
            this.moveHistoryComponent.moveToEnd();
        }
    }
}
