// Represents the game board for Tic-Tac-Toe
class GameBoard {
  constructor() {
    // Initialises an empty 3x3 board with dashes
    this.board = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
  }

  // Returns a deep copy of the current board state
  getBoard = () => this.board.map((row) => [...row]);

  // Attempts to place the player's symbol at the given position
  // Returns true if the move was successful, false otherwise
  makeMove = (player, row, col) => {
    if (this.board[row][col] === "-") {
      this.board[row][col] = player.symbol;
      return true;
    }
    return false;
  };

  // Checks if there is a winner or a draw
  // Returns "X", "O", "draw", or null
  checkWin = () => {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] !== "-" &&
        this.board[i][0] === this.board[i][1] &&
        this.board[i][1] === this.board[i][2]
      ) {
        return this.board[i][0];
      }
      if (
        this.board[0][i] !== "-" &&
        this.board[0][i] === this.board[1][i] &&
        this.board[1][i] === this.board[2][i]
      ) {
        return this.board[0][i];
      }
    }

    // Check diagonals
    if (
      this.board[0][0] !== "-" &&
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
    ) {
      return this.board[0][0];
    }
    if (
      this.board[0][2] !== "-" &&
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
    ) {
      return this.board[0][2];
    }

    // Check for draw
    return this.board.flat().every((cell) => cell !== "-") ? "draw" : null;
  };

  // Resets the board to its initial empty state
  resetBoard = () => {
    this.board = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
  };
}

// Represents a player in the game
class Player {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }
}

// Manages the overall game logic
class Game {
  constructor(playerXName, playerOName) {
    this.board = new GameBoard();
    this.playerX = new Player(playerXName, "X");
    this.playerO = new Player(playerOName, "O");
    this.currentPlayer = this.playerX; // Starts with player X
  }

  // Handles a player's turn
  // Returns a message if there's a winner or draw, otherwise null
  playTurn = (row, col) => {
    if (!this.board.makeMove(this.currentPlayer, row, col))
      return "Invalid move";

    let result = this.board.checkWin();

    if (result) {
      return result === "draw"
        ? "It's a Draw"
        : `Player ${this.currentPlayer.name} has won!`;
    }

    // Switch turns
    this.currentPlayer =
      this.currentPlayer === this.playerX ? this.playerO : this.playerX;

    return null;
  };

  // Renders the current state of the board to the interface
  renderBoard() {
    const currentBoard = this.getBoard();

    for (let row = 0; row < currentBoard.length; row++) {
      for (let col = 0; col < currentBoard[row].length; col++) {
        const button = document.getElementById(`btn${row}${col}`);
        if (button) {
          button.innerHTML =
            currentBoard[row][col] === "-"
              ? ""
              : `<p class="${
                  currentBoard[row][col] === "X" ? "x-color" : "o-color"
                }">${currentBoard[row][col]}</p>`;
        }
      }
    }
  }

  // Proxy methods
  getBoard = () => this.board.getBoard();
  resetGameBoard = () => this.board.resetBoard();
  getCurrentPlayer = () => this.currentPlayer;
}

// DOM elements for interaction
const dialog = document.getElementById("nameDialog");
const form = document.getElementById("dialogForm");
const resetBtn = document.getElementById("reset");

// Resets the game interface and shows the name input dialog
const resetGame = () => {
  const buttons = document.querySelectorAll("[id^=btn]");

  // Enable all buttons
  buttons.forEach((btn) => {
    btn.disabled = false;
  });

  // Show the name input dialog
  dialog.showModal();
};

// Handles the form submission to start the game
form.addEventListener("submit", (event) => {
  const xname = document.getElementById("playerX").value;
  const oname = document.getElementById("playerO").value;

  dialog.close(); // Close the dialog
  startGame(xname, oname);
});

// Starts a new game session
function startGame(xname, oname) {
  // Create a new game instance
  const game = new Game(xname, oname);
  const buttons = document.querySelectorAll("[id^=btn]");

  game.renderBoard();

  // Reset button event
  resetBtn.addEventListener("click", () => {
    game.resetGameBoard();
    resetGame(); // Reset UI and reopen name dialog
    document.getElementById("display-current").style.color = "#cdd6f4";
  });

  // Clear board buttons and enable them
  buttons.forEach((btn) => {
    btn.innerHTML = "";
    btn.disabled = false;
  });

  // Updates the current player display
  const updateCurrent = () => {
    document.getElementById("display-current").innerHTML = `${
      game.getCurrentPlayer().name
    }`;
  };

  // Displays the winner or draw result
  const winnerDisplay = (result) => {
    document.getElementById("display-current").innerHTML = `${result}`;
    document.getElementById("display-current").style.color = "#f9e2af";
  };

  // Assign click events to buttons
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const [row, col] = btn.id.slice(-2).split("").map(Number);

      const result = game.playTurn(row, col);

      game.renderBoard();

      btn.disabled = true; // Disable the clicked button

      if (result) {
        setTimeout(() => {
          winnerDisplay(result);
          buttons.forEach((btn) => (btn.disabled = true));
        }, 100);
      }

      updateCurrent();
    });
  });

  updateCurrent(); // Show the starting player
}
