# Tic Tac Toe Game - Vanilla JS

This is a simple Tic Tac Toe game built with **Vanilla JavaScript**, HTML, and CSS. The main goal of this pet project is to demonstrate different communication technologies between tabs of the same domain, while adhering to Object-Oriented Programming (OOP) principles.

## Project Features
- **Player vs Computer mode**
- **Score tracking**
- **Communication between browser tabs using different APIs**
- **Algorithm for Computer Move**: The computer makes its moves based on a strategy that includes checking for potential wins, blocking the player from winning, and using a prioritized move set to enhance its gameplay.

## Technologies Used
- **Vanilla JavaScript** (no external libraries or frameworks used)
- **HTML** & **CSS** for structure and styling
- **Flexbox** for layout
- **APIs used for cross-tab communication:**
  - `localStorage`
  - `SharedWorker`
  - `BroadcastChannel`

## OOP Principles Implemented
The project is built using the following Object-Oriented Programming (OOP) principles:
- **Inheritance**: Classes inherit properties and methods from other classes (e.g., `DataSaver` class is inherited by `LocalStorageManager`, `SharedWorkerManager`, and `BroadcastChannelManager`).
- **Encapsulation**: Internal states and data are encapsulated within classes, and access is controlled via methods.
- **Abstraction**: Complex operations are abstracted within specific methods of classes, simplifying the user interface interaction.
- **Polymorphism**: The classes that extend `DataSaver` implement different ways to save and retrieve game data, allowing for different storage strategies.

## Setup and Installation
To run this project locally, you need to use a server since it relies on modules that are supported in server environments. You can set up a simple local server using Node.js, any other server software, or you can use the **Live Server** extension in **Visual Studio Code** for quick setup and automatic page reloads during development.



