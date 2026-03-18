const container = document.getElementById("visualizer-container");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const generateBtn = document.getElementById("generateBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const customInputBtn = document.getElementById("customInputBtn");
const stopBtn = document.getElementById("stopBtn");
const infoBtn = document.getElementById("infoBtn");
const compareBtn = document.getElementById("compareBtn");
const algoButtons = document.querySelectorAll(".algo-btn");
const compCountEl = document.getElementById("compCount");
const timeTakenEl = document.getElementById("timeTaken");
const currentAlgoDisplay = document.getElementById("currentAlgoDisplay");
const dataTypeSelect = document.getElementById("dataType");

let array = [];
let isSorting = false;
let abortSignal = false;
let comparisons = 0;
let startTime = 0;
let currentAlgo = "";

function renderArray() {
    container.innerHTML = "";
    const barWidth = Math.max((container.clientWidth / array.length) - 2, 2); 
    const maxVal = Math.max(...array);
    const scaleFactor = (container.clientHeight - 80) / maxVal;

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        const heightPx = Math.max(array[i] * scaleFactor, 10); 
        
        bar.style.height = `${heightPx}px`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add("bar");
        
        const valLabel = document.createElement("span");
        valLabel.classList.add("val-label");
        valLabel.innerText = array[i];
        if (barWidth < 18) valLabel.style.display = 'none';
        
        const idxLabel = document.createElement("span");
        idxLabel.classList.add("idx-label");
        idxLabel.innerText = i;
        if (array.length > 20) idxLabel.style.display = 'none';

        bar.appendChild(valLabel);
        bar.appendChild(idxLabel);
        container.appendChild(bar);
    }
    comparisons = 0;
    compCountEl.innerText = "0";
    timeTakenEl.innerText = "0.00";
}

function generateArray() {
    if (isSorting) return;
    array = [];
    const size = parseInt(sizeSlider.value);
    const type = dataTypeSelect.value;

    if (type === 'few_unique') {
        const uniqueValues = [25, 50, 75, 100, 150];
        for (let i = 0; i < size; i++) {
            array.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
        }
    } else {
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 200) + 10);
        }
    }

    if (type === 'reversed') {
        array.sort((a, b) => b - a);
    } else if (type === 'nearly') {
        array.sort((a, b) => a - b);
        for (let i = 0; i < Math.max(1, size / 10); i++) {
            let idx1 = Math.floor(Math.random() * size);
            let idx2 = Math.floor(Math.random() * size);
            [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
        }
    }
    renderArray();
}

function shuffleArray() {
    if (isSorting) return;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    renderArray();
}

function applyCustomData() {
    const input = document.getElementById("customDataInput").value;
    const errorEl = document.getElementById("customInputError");
    const parsed = input.split(',').map(item => parseInt(item.trim(), 10));
    
    if (parsed.some(isNaN) || parsed.length < 2 || parsed.length > 150) {
        errorEl.innerText = "Please enter between 2 and 150 valid numbers.";
        errorEl.style.display = "block";
        return;
    }
    errorEl.style.display = "none";
    array = parsed;
    renderArray();
    closeModal('customInputModal');
    sizeSlider.value = array.length;
}

const sleep = () => new Promise(res => setTimeout(res, 101 - speedSlider.value));

function updateMetrics() {
    compCountEl.innerText = comparisons;
    timeTakenEl.innerText = (performance.now() - startTime).toFixed(2);
}

function swapBars(i, j, bars) {
    let tempH = bars[i].style.height;
    let tempText = bars[i].querySelector(".val-label").innerText;
    bars[i].style.height = bars[j].style.height;
    bars[i].querySelector(".val-label").innerText = bars[j].querySelector(".val-label").innerText;
    bars[j].style.height = tempH;
    bars[j].querySelector(".val-label").innerText = tempText;
}

function setUIState(sorting) {
    isSorting = sorting;
    abortSignal = false;
    generateBtn.disabled = sorting;
    shuffleBtn.disabled = sorting;
    customInputBtn.disabled = sorting;
    compareBtn.disabled = sorting;
    sizeSlider.disabled = sorting;
    dataTypeSelect.disabled = sorting;
    stopBtn.disabled = !sorting;
    algoButtons.forEach(btn => {
        btn.disabled = sorting;
        if(sorting && !btn.classList.contains('active')) btn.style.opacity = "0.4";
        else btn.style.opacity = "1";
    });
}

stopBtn.addEventListener('click', () => { abortSignal = true; });
shuffleBtn.addEventListener('click', shuffleArray);
customInputBtn.addEventListener('click', () => {
    document.getElementById('customDataInput').value = array.join(', ');
    document.getElementById('customInputError').style.display = 'none';
    document.getElementById('customInputModal').classList.add('active');
});

const algoData = {
    bubble: { name: "Bubble Sort", timeWorst: "O(n²)", timeBest: "O(n)", space: "O(1)", desc: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.", bestFor: "Teaching purposes or when the array is already mostly sorted.", worstFor: "Large, randomized datasets." },
    selection: { name: "Selection Sort", timeWorst: "O(n²)", timeBest: "O(n²)", space: "O(1)", desc: "Divides the input list into a sorted and unsorted sublist. Repeatedly selects the smallest element from the unsorted sublist and swaps it.", bestFor: "Situations where memory write operations are extremely expensive.", worstFor: "Large datasets." },
    insertion: { name: "Insertion Sort", timeWorst: "O(n²)", timeBest: "O(n)", space: "O(1)", desc: "Builds the final sorted array one item at a time by inserting each element into its correct position.", bestFor: "Small arrays or arrays that are nearly sorted.", worstFor: "Large, reverse-sorted datasets." },
    merge: { name: "Merge Sort", timeWorst: "O(n log n)", timeBest: "O(n log n)", space: "O(n)", desc: "Divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.", bestFor: "Large datasets where stable sorting is required.", worstFor: "Environments with strict memory constraints." },
    quick: { name: "Quick Sort", timeWorst: "O(n²)", timeBest: "O(n log n)", space: "O(log n)", desc: "Picks an element as pivot and partitions the array around it, placing smaller elements left and larger right.", bestFor: "General-purpose sorting. Highly cache-efficient.", worstFor: "Security against worst-case O(n²) time unless a random pivot is used." },
    heap: { name: "Heap Sort", timeWorst: "O(n log n)", timeBest: "O(n log n)", space: "O(1)", desc: "Converts the array into a Max-Heap structure, repeatedly extracting the maximum element.", bestFor: "Large datasets requiring in-place sorting and guaranteed O(n log n) time.", worstFor: "Modern systems where cache locality is important." }
};

document.getElementById('recommenderBtn').addEventListener('click', () => {
    document.getElementById('recommenderModal').classList.add('active');
});

infoBtn.addEventListener('click', () => {
    if(!currentAlgo) return;
    const data = algoData[currentAlgo];
    document.getElementById('modalTitle').innerText = data.name;
    document.getElementById('modalTimeWorst').innerText = data.timeWorst;
    document.getElementById('modalTimeBest').innerText = data.timeBest;
    document.getElementById('modalSpace').innerText = data.space;
    document.getElementById('modalDesc').innerText = data.desc;
    document.getElementById('modalBestFor').innerText = data.bestFor;
    document.getElementById('modalWorstFor').innerText = data.worstFor;
    document.getElementById('infoModal').classList.add('active');
});

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    if(id === 'recommenderModal') document.getElementById('recommendationResult').classList.add('hidden');
}

function getRecommendation() {
    const size = document.getElementById('recSize').value;
    const mem = document.getElementById('recMem').value;
    const dataState = document.getElementById('recData').value;
    let resultAlgo = "", reason = "";

    if (dataState === "nearly" && size === "small") {
        resultAlgo = "Insertion Sort"; reason = "Because the data is small and nearly sorted, Insertion Sort runs very fast without extra memory.";
    } else if (size === "large" && mem === "strict") {
        resultAlgo = "Heap Sort"; reason = "You have lots of data but strict memory limits. Heap Sort guarantees O(n log n) time using O(1) space.";
    } else if (size === "large" && mem === "flexible") {
        resultAlgo = "Merge Sort"; reason = "Since you have memory to spare, Merge Sort guarantees stable O(n log n) time.";
    } else {
        resultAlgo = "Quick Sort"; reason = "Quick Sort is highly cache-efficient and sorts in-place, making it the standard choice.";
    }
    document.getElementById('recResultName').innerText = resultAlgo;
    document.getElementById('recResultReason').innerText = reason;
    document.getElementById('recommendationResult').classList.remove('hidden');
}

/* --- Pure Logic For Benchmarking (No DOM Updates) --- */
const pureSorts = {
    "Bubble Sort": (arr) => { let c=0; for(let i=0; i<arr.length; i++) for(let j=0; j<arr.length-i-1; j++) { c++; if(arr[j]>arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; } return c; },
    "Selection Sort": (arr) => { let c=0; for(let i=0; i<arr.length; i++) { let m=i; for(let j=i+1; j<arr.length; j++) { c++; if(arr[j]<arr[m]) m=j; } [arr[i], arr[m]] = [arr[m], arr[i]]; } return c; },
    "Insertion Sort": (arr) => { let c=0; for(let i=1; i<arr.length; i++) { let k=arr[i], j=i-1; while(j>=0) { c++; if(arr[j]>k) { arr[j+1]=arr[j]; j--; } else break; } arr[j+1]=k; } return c; },
    "Merge Sort": function sort(arr) { 
        let c=0;
        function mSort(a) { if(a.length<=1) return a; let mid=Math.floor(a.length/2), left=mSort(a.slice(0,mid)), right=mSort(a.slice(mid)); return merge(left,right); }
        function merge(l,r) { let res=[], i=0, j=0; while(i<l.length && j<r.length) { c++; if(l[i]<=r[j]) res.push(l[i++]); else res.push(r[j++]); } return res.concat(l.slice(i)).concat(r.slice(j)); }
        mSort(arr); return c;
    },
    "Quick Sort": function sort(arr) {
        let c=0;
        function qSort(a, low, high) { if(low<high) { let pi=partition(a,low,high); qSort(a,low,pi-1); qSort(a,pi+1,high); } }
        function partition(a, low, high) { let p=a[high], i=low-1; for(let j=low; j<high; j++) { c++; if(a[j]<p) { i++; [a[i],a[j]]=[a[j],a[i]]; } } [a[i+1],a[high]]=[a[high],a[i+1]]; return i+1; }
        qSort(arr, 0, arr.length-1); return c;
    },
    "Heap Sort": function sort(arr) {
        let c=0, n=arr.length;
        function heapify(a, n, i) { let max=i, l=2*i+1, r=2*i+2; if(l<n) { c++; if(a[l]>a[max]) max=l; } if(r<n) { c++; if(a[r]>a[max]) max=r; } if(max!=i) { [a[i],a[max]]=[a[max],a[i]]; heapify(a,n,max); } }
        for(let i=Math.floor(n/2)-1; i>=0; i--) heapify(arr,n,i);
        for(let i=n-1; i>0; i--) { [arr[0],arr[i]]=[arr[i],arr[0]]; heapify(arr,i,0); }
        return c;
    }
};

compareBtn.addEventListener('click', () => {
    if (isSorting) return;
    document.getElementById('benchSizeInfo').innerText = array.length;
    const tbody = document.getElementById('benchTableBody');
    tbody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>Running benchmarks...</td></tr>";
    document.getElementById('benchmarkModal').classList.add('active');

    // Slight timeout to let DOM update before heavy sync CPU tasks
    setTimeout(() => {
        const iterations = 1000;
        const results = [];

        // 1. Run benchmarks and store results
        for (const [name, sortFunc] of Object.entries(pureSorts)) {
            let comps = 0;
            
            // Warm-up run
            sortFunc([...array]);

            // Start the actual timer
            const t0 = performance.now();
            for (let i = 0; i < iterations; i++) {
                const arrCopy = [...array]; 
                comps = sortFunc(arrCopy); 
            }
            const t1 = performance.now();
            
            const avgTime = (t1 - t0) / iterations;
            results.push({ name, comps, avgTime });
        }

        // 2. Find the fastest execution time
        const minTime = Math.min(...results.map(r => r.avgTime));

        // 3. Render the table and highlight the winner
        tbody.innerHTML = "";
        results.forEach(res => {
            const tr = document.createElement('tr');
            
            // Apply highlight styling if this is the fastest algorithm
            let icon = "";
            if (res.avgTime === minTime) {
                tr.style.backgroundColor = "rgba(16, 185, 129, 0.15)"; // Soft green background
                tr.style.color = "var(--bar-sorted)"; // Green text
                tr.style.fontWeight = "bold";
                icon = ' <i class="fa-solid fa-trophy" style="margin-left: 8px;"></i>';
            }

            tr.innerHTML = `
                <td>${res.name}${icon}</td>
                <td>${res.comps.toLocaleString()}</td>
                <td>${res.avgTime.toFixed(4)}</td>
            `;
            tbody.appendChild(tr);
        });
    }, 100);
});

/* --- Visual Sorting Algorithms --- */
async function bubbleSort(bars) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (abortSignal) return;
            bars[j].style.backgroundColor = "var(--bar-compare)"; bars[j+1].style.backgroundColor = "var(--bar-compare)";
            comparisons++; updateMetrics(); await sleep();
            if (array[j] > array[j+1]) { [array[j], array[j+1]] = [array[j+1], array[j]]; swapBars(j, j+1, bars); }
            bars[j].style.backgroundColor = "var(--bar-default)"; bars[j+1].style.backgroundColor = "var(--bar-default)";
        }
        bars[array.length - i - 1].style.backgroundColor = "var(--bar-sorted)";
    }
}

async function selectionSort(bars) {
    for (let i = 0; i < array.length; i++) {
        let minIdx = i; bars[i].style.backgroundColor = "var(--bar-pivot)";
        for (let j = i + 1; j < array.length; j++) {
            if (abortSignal) return;
            bars[j].style.backgroundColor = "var(--bar-compare)"; comparisons++; updateMetrics(); await sleep();
            if (array[j] < array[minIdx]) {
                if (minIdx !== i) bars[minIdx].style.backgroundColor = "var(--bar-default)";
                minIdx = j; bars[minIdx].style.backgroundColor = "var(--bar-pivot)";
            } else { bars[j].style.backgroundColor = "var(--bar-default)"; }
        }
        [array[i], array[minIdx]] = [array[minIdx], array[i]]; swapBars(i, minIdx, bars);
        bars[minIdx].style.backgroundColor = "var(--bar-default)"; bars[i].style.backgroundColor = "var(--bar-sorted)";
    }
}

async function insertionSort(bars) {
    for (let i = 1; i < array.length; i++) {
        let key = array[i], keyHeight = bars[i].style.height, keyText = bars[i].querySelector(".val-label").innerText, j = i - 1;
        bars[i].style.backgroundColor = "var(--bar-compare)"; await sleep();
        while (j >= 0 && array[j] > key) {
            if (abortSignal) return;
            comparisons++; updateMetrics();
            array[j + 1] = array[j];
            bars[j + 1].style.height = bars[j].style.height; bars[j+1].querySelector(".val-label").innerText = bars[j].querySelector(".val-label").innerText;
            bars[j].style.backgroundColor = "var(--bar-compare)"; j--; await sleep();
            for(let k=i; k>=0; k--) bars[k].style.backgroundColor = "var(--bar-sorted)";
        }
        array[j + 1] = key; bars[j + 1].style.height = keyHeight; bars[j + 1].querySelector(".val-label").innerText = keyText;
    }
    for(let bar of bars) bar.style.backgroundColor = "var(--bar-sorted)";
}

async function mergeLogic(bars, l, m, r) {
    let n1 = m - l + 1, n2 = r - m, L = new Array(n1), R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (abortSignal) return;
        bars[k].style.backgroundColor = "var(--bar-compare)"; comparisons++; updateMetrics(); await sleep();
        if (L[i] <= R[j]) { array[k] = L[i]; bars[k].style.height = Math.max((L[i] / Math.max(...array)) * (container.clientHeight - 80), 10) + "px"; bars[k].querySelector(".val-label").innerText = L[i]; i++; } 
        else { array[k] = R[j]; bars[k].style.height = Math.max((R[j] / Math.max(...array)) * (container.clientHeight - 80), 10) + "px"; bars[k].querySelector(".val-label").innerText = R[j]; j++; }
        bars[k].style.backgroundColor = "var(--bar-sorted)"; k++;
    }
    while (i < n1) { if (abortSignal) return; array[k] = L[i]; bars[k].style.height = Math.max((L[i] / Math.max(...array)) * (container.clientHeight - 80), 10) + "px"; bars[k].querySelector(".val-label").innerText = L[i]; bars[k].style.backgroundColor = "var(--bar-sorted)"; i++; k++; await sleep(); }
    while (j < n2) { if (abortSignal) return; array[k] = R[j]; bars[k].style.height = Math.max((R[j] / Math.max(...array)) * (container.clientHeight - 80), 10) + "px"; bars[k].querySelector(".val-label").innerText = R[j]; bars[k].style.backgroundColor = "var(--bar-sorted)"; j++; k++; await sleep(); }
}

async function mergeSort(bars, l = 0, r = array.length - 1) {
    if (abortSignal || l >= r) return;
    for(let i = l; i <= r; i++) bars[i].style.backgroundColor = "var(--bar-split)"; await sleep();
    for(let i = l; i <= r; i++) bars[i].style.backgroundColor = "var(--bar-default)";
    let m = l + Math.floor((r - l) / 2); await mergeSort(bars, l, m); await mergeSort(bars, m + 1, r); await mergeLogic(bars, l, m, r);
}

async function partition(bars, low, high) {
    let pivot = array[high]; bars[high].style.backgroundColor = "var(--bar-pivot)"; let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (abortSignal) return;
        bars[j].style.backgroundColor = "var(--bar-compare)"; comparisons++; updateMetrics(); await sleep();
        if (array[j] < pivot) { i++; [array[i], array[j]] = [array[j], array[i]]; swapBars(i, j, bars); }
        bars[j].style.backgroundColor = "var(--bar-default)";
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]]; swapBars(i + 1, high, bars);
    bars[high].style.backgroundColor = "var(--bar-default)"; return i + 1;
}

async function quickSort(bars, low = 0, high = array.length - 1) {
    if (abortSignal) return;
    if (low < high) {
        let pi = await partition(bars, low, high); bars[pi].style.backgroundColor = "var(--bar-sorted)";
        await quickSort(bars, low, pi - 1); await quickSort(bars, pi + 1, high);
    } else if (low >= 0 && high >= 0 && low < array.length && high < array.length) { bars[high].style.backgroundColor = "var(--bar-sorted)"; bars[low].style.backgroundColor = "var(--bar-sorted)"; }
}

async function heapify(bars, n, i) {
    if (abortSignal) return;
    let largest = i, left = 2 * i + 1, right = 2 * i + 2;
    comparisons++; if (left < n && array[left] > array[largest]) largest = left;
    comparisons++; if (right < n && array[right] > array[largest]) largest = right;
    if (largest != i) {
        bars[i].style.backgroundColor = "var(--bar-compare)"; bars[largest].style.backgroundColor = "var(--bar-compare)"; updateMetrics(); await sleep();
        [array[i], array[largest]] = [array[largest], array[i]]; swapBars(i, largest, bars);
        bars[i].style.backgroundColor = "var(--bar-default)"; bars[largest].style.backgroundColor = "var(--bar-default)";
        await heapify(bars, n, largest);
    }
}

async function heapSort(bars) {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) { if (abortSignal) return; await heapify(bars, n, i); }
    for (let i = n - 1; i > 0; i--) {
        if (abortSignal) return;
        bars[0].style.backgroundColor = "var(--bar-pivot)"; bars[i].style.backgroundColor = "var(--bar-compare)"; await sleep();
        [array[0], array[i]] = [array[i], array[0]]; swapBars(0, i, bars);
        bars[i].style.backgroundColor = "var(--bar-sorted)"; bars[0].style.backgroundColor = "var(--bar-default)";
        await heapify(bars, i, 0);
    }
    if (!abortSignal) bars[0].style.backgroundColor = "var(--bar-sorted)";
}

algoButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        if (isSorting) return;
        algoButtons.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        currentAlgo = btn.dataset.algo; currentAlgoDisplay.innerText = btn.innerText; infoBtn.disabled = false;
        
        setUIState(true); startTime = performance.now(); const bars = document.getElementsByClassName("bar");
        
        if (currentAlgo === 'bubble') await bubbleSort(bars);
        if (currentAlgo === 'selection') await selectionSort(bars);
        if (currentAlgo === 'insertion') await insertionSort(bars);
        if (currentAlgo === 'quick') await quickSort(bars);
        if (currentAlgo === 'merge') await mergeSort(bars);
        if (currentAlgo === 'heap') await heapSort(bars);
        
        if (!abortSignal) { for(let bar of bars) bar.style.backgroundColor = "var(--bar-sorted)"; }
        setUIState(false);
    });
});

sizeSlider.addEventListener('input', generateArray); dataTypeSelect.addEventListener('change', generateArray);
generateBtn.addEventListener('click', generateArray); window.addEventListener('resize', () => { if(!isSorting) renderArray() });

generateArray();