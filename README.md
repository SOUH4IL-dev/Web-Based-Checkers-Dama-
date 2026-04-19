# ♟️ Web-Based Checkers (Dama)

A fully functional **browser-based Checkers (Dama) game** built using **Vanilla JavaScript, HTML5, and CSS3**.
The project implements complete official checkers rules with advanced game logic and interactive UI.

---

## 🚀 Features

### 🧠 Game Logic

* ♟️ **Mandatory Capture Rule** (forced jumps)
* 🔁 **Multi-Jump System** using DFS (Depth-First Search)
* 👑 **King Promotion** with bidirectional movement
* ⚖️ **Win / Draw Detection System**

  * Elimination of all opponent pieces
  * No available moves (stalemate)
  * 40-move rule without capture
  * Endgame draw (only kings remaining)

---

### 🎮 Gameplay

* Interactive click-based movement system
* Real-time move highlighting
* Turn-based logic (Red vs Black)
* Smooth piece movement and visual feedback

---

### 📱 UI/UX

* Responsive board layout
* Clean grid-based design (Flexbox / CSS Grid)
* Highlighted valid moves
* Smooth animations for piece transitions

---

## 🛠️ Tech Stack

* **HTML5** → Game structure
* **CSS3** → Board styling & animations
* **JavaScript (ES6+)** → Game engine & logic
* **Algorithm** → DFS for multi-jump detection

---

## 🎮 How to Play

1. Red player always starts first
2. Click on a piece to select it
3. Available moves are highlighted in green
4. Capture opponent pieces when possible (mandatory rule)
5. Reach opponent’s last row to promote a King 👑

---

## ⚙️ Installation

```bash id="inst1"
git clone https://github.com/SOUH4IL-dev/checkers-game.git
```

Then:

* Open `index.html` in your browser
* Start playing instantly 🎮

---

## 📁 Project Structure

```bash id="struct1"
checkers-game/
│
├── index.html      # Game UI layout
├── script.js       # Game engine (rules + logic)
├── style.css       # Styling & animations
```

---

## 🧠 Core Algorithm

The game uses **DFS (Depth-First Search)** to calculate:

* All possible capture paths
* Multi-jump sequences
* Optimal forced moves

This ensures full compliance with official checkers rules.

---

## 📌 Future Improvements

* 🤖 AI opponent (Minimax algorithm)
* 🌐 Online multiplayer mode
* 📊 Move history system
* 📱 Mobile touch optimization
* 🎵 Sound effects & game feedback

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**SOUH4IL-dev**
GitHub: https://github.com/SOUH4IL-dev
