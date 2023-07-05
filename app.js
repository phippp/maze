export class Maze {
    constructor(x, y, ...colours) {
        this.tree = new Tree();
        this.params = { width: Math.max(x, 15), height: Math.max(y, 10), size: x < 20 ? 50 : 25 };
        this.grid = new Array(this.params.width)
            .fill(void 0)
            .map(_ => new Array(this.params.height)
            .fill(void 0));
        this.grid[0][0] = 1;
        this.heatmap = colours.length > 0 ? { start: colours[0], end: colours[1] } : null;
    }
    getTree() { return this.tree; }
    getGrid() { return this.grid; }
    getParams() { return this.params; }
    getHeatmap() { return this.heatmap; }
    getNext() {
        let adj = [];
        let [x, y] = this.tree.getCurrent().getCoords();
        let key;
        for (key in DIRECTIONS) {
            if (this.checkInside(DIRECTIONS[key][0], DIRECTIONS[key][1]))
                adj.push(key);
        }
        if (adj.length === 0)
            return false;
        key = adj[Math.floor(Math.random() * adj.length)];
        let [cx, cy] = [x + DIRECTIONS[key][0], y + DIRECTIONS[key][1]];
        this.tree.addNode([cx, cy]);
        this.grid[cx][cy] = 1;
        return DIRECTIONS[key];
    }
    checkInside(dx, dy) {
        let [x, y] = this.tree.getCurrent().getCoords();
        let cx = x + dx, cy = y + dy;
        return (cx >= 0 && cx < this.params.width)
            && (cy >= 0 && cy < this.params.height)
            && this.grid[cx][cy] === void 0;
    }
    getColour() {
        if (this.heatmap === null)
            return "#ffffff";
        let f = Math.min(1, this.tree.getDepth() * 1.7 / (this.params.width * this.params.height));
        let c0 = this.heatmap.start.match(/.{1,2}/g);
        let c1 = this.heatmap.end.match(/.{1,2}/g);
        if (c0 === null || c1 === null)
            return "#ffffff";
        let cl0 = c0.map((oct) => parseInt(oct, 16) * (1 - f));
        let cl1 = c1.map((oct) => parseInt(oct, 16) * f);
        let ci = [0, 1, 2].map(i => Math.min(Math.round(cl0[i] + cl1[i]), 255));
        return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, "0");
    }
    getConfig() {
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
};
class TreeNode {
    constructor(parent, coords, ...children) {
        this.children = children;
        this.coords = coords;
        this.parent = parent;
    }
    getParent() { return this.parent; }
    getChildren() { return this.children; }
    getCoords() { return this.coords; }
    addChild(coords) {
        let n = new TreeNode(this, coords);
        this.children.push(n);
        return n;
    }
}
class Tree {
    constructor() {
        this.root = new TreeNode(null, [0, 0]);
        this.current = this.root;
        this.depth = 1;
    }
    getRoot() { return this.root; }
    getCurrent() { return this.current; }
    getDepth() { return this.depth; }
    addNode(coords) {
        this.current = this.current.addChild(coords);
        this.depth++;
    }
    back() {
        if (this.current.parent === null)
            return false;
        this.current = this.current.parent;
        this.depth--;
        return true;
    }
}
//# sourceMappingURL=app.js.map