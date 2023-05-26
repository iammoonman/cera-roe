import dagre from 'dagre';
import { Edge, isNode, Node } from 'react-flow-renderer';

export const makeLayout = (elements: (Node | Edge)[], offset: number): Node[] => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: 55 })
    g.setDefaultEdgeLabel(() => ({}))

    elements.forEach((element) => {
        if (isNode(element)) {
            g.setNode(element.id, {
                width: 380,
                height: 50,
            });
        } else {
            g.setEdge(element.source, element.target);
        }
    })
    dagre.layout(g);
    return elements.filter(d => isNode(d)).map((element) => {
        const node = g.node(element.id);
        //console.log(node)
        var q: Node = {
            id: element.id,
            position: {
                x: offset + node.x - node.width / 2,
                y: offset + node.y - node.height / 2,
            },
            data: element.data,
            type: element.type
        };
        return q
    });
}