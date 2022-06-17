import { AfterViewInit, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public showHistory: boolean = true;

  // ngOnInit(): void {
  //   console.log(`ngOnInit#window#inner innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}, outerHeight: ${window.outerHeight}, outerWidth: ${window.outerWidth}`);
  //   this.setBoardSize();
  // }

  ngAfterViewInit(): void {
    console.log(`ngAfterViewInit#window#inner innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}, outerHeight: ${window.outerHeight}, outerWidth: ${window.outerWidth}`);
    this.setBoardSize();
  }

  @HostListener('window:resize') onResize() {
    console.log(`ngAfterViewInit#window#inner innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}, outerHeight: ${window.outerHeight}, outerWidth: ${window.outerWidth}`);
    this.setBoardSize();
  }



  private setBoardSize(): void {
    console.log(`setBoardSize innerHeight: ${window.innerHeight}, innerWidth: ${window.innerWidth}, outerHeight: ${window.outerHeight}, outerWidth: ${window.outerWidth}`);

    const chessBoardSplitted: Element | null = document.getElementsByClassName("splittedChessBoard")?.item(0);
    console.log("chessBoardSplitted: " + chessBoardSplitted + " chessBoard: " + (chessBoardSplitted instanceof HTMLElement));

    const chessBoardSingle: Element | null = document.getElementsByClassName('singleChessBoard')?.item(0);
    console.log("chessBoardSingle: " + chessBoardSingle + " chessBoard: " + (chessBoardSingle instanceof HTMLElement));

    const chessBoardsByType = document.getElementsByTagName('app-chess-board');
    console.log("chessBoardsByType.length " + chessBoardsByType.length);;

    const chessBoard = chessBoardSplitted !== null ? chessBoardSplitted : chessBoardSingle;
    console.log("chessBoard: " + chessBoard + " chessBoard: " + (chessBoard instanceof HTMLElement));

    // if (chessBoard instanceof HTMLElement) {
    let baseSize;
    if (window.outerHeight < window.outerWidth) {
      console.log(`Set to height window.outerHeight ${window.outerHeight}`);
      baseSize = window.outerHeight * 0.95;
      this.showHistory = true;

      if (chessBoardSplitted instanceof HTMLElement) {
        chessBoardSplitted.style.width = baseSize + "px";
        chessBoardSplitted.style.height = baseSize + "px";
      }
    }
    else {
      console.log(`Set to height window.outerHeight ${window.outerWidth}`);
      baseSize = window.outerWidth * 0.95;
      this.showHistory = false;

      if (chessBoardSingle instanceof HTMLElement) {
        chessBoardSingle.style.width = baseSize + "px";
        chessBoardSingle.style.height = baseSize + "px";
      }
    }
  }
  // }
}
