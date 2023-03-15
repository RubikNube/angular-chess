import { MoveHistoryComponent } from "../components/move-history/move-history.component";
import { MoveHistoryService } from "./move-history.service";

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
    constructor(private moveHistoryService: MoveHistoryService) {
        // subscribe to key events
        document.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeydown(event));
    }

    public handleKeydown(event: KeyboardEvent): void {
        if (event.key === "ArrowUp") {
            this.moveHistoryService.moveToStart();
        } else if (event.key === "ArrowLeft") {
            this.moveHistoryService.moveBack();
        } else if (event.key === "ArrowRight") {
            this.moveHistoryService.moveForward();
        } else if (event.key === "ArrowDown") {
            this.moveHistoryService.moveToEnd();
        }
    }
}
