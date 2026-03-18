# 📊 AlgoVis Pro | Practical Edition

**Live Demo:** [Click here to view the live project](https://prince-s-code.github.io/Sorting-algo-visualizer/)

AlgoVis Pro is a robust, interactive web application designed to help developers and students visualize, understand, and benchmark sorting algorithms. Built entirely with HTML, CSS, and Vanilla JavaScript, it goes beyond standard visualization by offering real-time CPU benchmarking and an intelligent algorithm recommender.

## ✨ Key Features

* **Real-Time Visualization:** Watch sorting algorithms process data step-by-step with color-coded bars indicating unsorted, comparing, pivot, and sorted states.
* **High-Precision Benchmarking ("Compare All"):** Runs the current array through all algorithms 1,000 times in the background to bypass browser timer limitations, providing highly accurate, microsecond-level execution times. Automatically highlights the fastest algorithm.
* **Custom Data Inputs:** Generate random, reversed, nearly sorted, or few-unique arrays, or type in your own custom comma-separated numbers.
* **Algorithm Recommender:** Answer a few quick questions about your data size and memory constraints to get a recommendation on which algorithm to use in the real world.
* **Detailed Analytics:** Live tracking of array comparisons and time taken during visualizations, plus an info panel detailing the Big-O time and space complexities of each algorithm.
* **Full Execution Control:** Adjust array size (up to 150 elements) and sorting speed dynamically. Includes a fail-safe "Stop" button to halt execution mid-sort.

## 🧮 Algorithms Included

1.  **Bubble Sort:** $O(n^2)$
2.  **Selection Sort:** $O(n^2)$
3.  **Insertion Sort:** $O(n^2)$
4.  **Merge Sort:** $O(n \log n)$
5.  **Quick Sort:** $O(n \log n)$
6.  **Heap Sort:** $O(n \log n)$

## 🚀 How to Run Locally

Since this is a static web application, no backend server or package installation is required!

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prince-s-code/Sorting-algo-visualizer.git](https://github.com/prince-s-code/Sorting-algo-visualizer.git)
    ```
2.  **Navigate to the project folder:**
    ```bash
    cd Sorting-algo-visualizer
    ```
3.  **Launch the App:**
    Open the `index.html` file in your preferred web browser (Chrome, Firefox, Edge, etc.). Alternatively, use the VS Code "Live Server" extension for a better development experience.

## 🛠️ Tech Stack

* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom UI, styling, CSS variables, and fluid animations.
* **Vanilla JavaScript (ES6+):** DOM manipulation, asynchronous sorting logic (`async/await`), and performance benchmarking (`performance.now()`).
* **FontAwesome:** For UI iconography.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/prince-s-code/Sorting-algo-visualizer/issues).
