export class Maze {
    // params
    tree: Tree;
    grid: number[][];
    params: {width: number, height: number, size: number};
    heatmap: {start: string, end: string} | null;
    // create instance
    constructor(x: number, y: number, ...colours: [string, string]){
        this.tree = new Tree();
        this.params = { width: Math.max(x, 15), height: Math.max(y, 10) , size: x < 20 ? 50 : 25}
        this.grid = new Array(this.params.width)
            .fill(void 0)
            .map(_ => 
                new Array(this.params.height)
                .fill(void 0)
            );
        this.grid[0][0] = 1;
        this.heatmap = colours.length > 0 ? {start: colours[0], end: colours[1]} : null;
    }
    // getters
    getTree() : Tree { return this.tree; }
    getGrid() : number[][] { return this.grid; }
    getParams() : {} { return this.params; }
    getHeatmap() : {} | null { return this.heatmap; }
    // 
    getNext() : number[] | boolean {
        // calculate possible options
        let adj: (keyof typeof DIRECTIONS)[] = [];
        let [x, y] = this.tree.getCurrent().getCoords();
        let key: keyof typeof DIRECTIONS;
        for(key in DIRECTIONS){
            if(this.checkInside(DIRECTIONS[key][0], DIRECTIONS[key][1]))
                adj.push(key);
        }
        if(adj.length === 0 ) return false;
        // select random option and add to structs
        key = adj[Math.floor(Math.random() * adj.length)];
        let [cx, cy] = [x + DIRECTIONS[key][0], y + DIRECTIONS[key][1]]
        this.tree.addNode([cx, cy]);
        this.grid[cx][cy] = 1;
        // return change in coords
        return DIRECTIONS[key];
    }
    checkInside(dx: number, dy: number) : boolean {
        let [x, y] = this.tree.getCurrent().getCoords();
        let cx = x + dx, cy = y + dy;
        return (cx >= 0 && cx < this.params.width) 
            && (cy >= 0 && cy < this.params.height) 
            && this.grid[cx][cy] === void 0;
    }
    getColour(): string {
        if(this.heatmap === null) return "#ffffff";
        let f = Math.min(1, this.tree.getDepth() * 1.7 / (this.params.width * this.params.height));
        let c0: RegExpMatchArray | null = this.heatmap.start.match(/.{1,2}/g);
        let c1: RegExpMatchArray | null = this.heatmap.end.match(/.{1,2}/g);
        if(c0 === null || c1 === null) return "#ffffff"; 
        let cl0: number[] = c0.map((oct) => parseInt(oct, 16) * (1-f));
        let cl1: number[] = c1.map((oct) => parseInt(oct, 16) * f);
        let ci: number[] = [0, 1, 2].map(i => Math.min(Math.round(cl0[i] + cl1[i]), 255));
        return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, "0");
    }

    getConfig(): {} {
        return {
            ratio: this.params.width / this.params.height,
            fullHeight: this.params.height * this.params.size,
            fullWidth: this.params.width * this.params.size
        };
    }
}

const DIRECTIONS = {
    up: [0, -1], down: [0, 1],
    left: [-1, 0], right: [1, 0]
}

class TreeNode {
    // params
    parent: TreeNode | null;
    children: TreeNode[];
    coords: [number, number];
    // create instance
    constructor(parent: TreeNode | null, coords: [number, number], ...children: TreeNode[]){
        this.children = children;
        this.coords = coords;
        this.parent = parent;
    }
    // getters
    getParent() { return this.parent; }
    getChildren() { return this.children; }
    getCoords() { return this.coords; }
    // 
    addChild(coords: [number, number]) {
        let n = new TreeNode(this, coords)
        this.children.push(n);
        return n;
    }
}

class Tree {
    // params
    root: TreeNode;
    current: TreeNode;
    depth: number;
    // create instance
    constructor() {
        this.root = new TreeNode(null, [0, 0]);
        this.current = this.root;
        this.depth = 1;
    }
    // getters
    getRoot() { return this.root; }
    getCurrent() { return this.current; }
    getDepth() { return this.depth; }
    //
    addNode(coords: [number, number]) {
        this.current = this.current.addChild(coords);
        this.depth++;
    }
    back() {
        if(this.current.parent === null)
            return false;
        this.current = this.current.parent;
        this.depth--;
        return true;
    }
}