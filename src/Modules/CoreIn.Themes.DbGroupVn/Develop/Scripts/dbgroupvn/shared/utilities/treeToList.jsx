function visitNode(node, hashMap, array, nodeKeyName) {
    if (!hashMap[ node[ nodeKeyName ] ]) {
        hashMap[ node[ nodeKeyName ] ] = true;
        array.push(node);
    }
}

/**
 * Convert a object to list
 * @param {Object} rootNode object with children(flat Array) property
 * @param {String} nodeKeyName node need a unique key, and this is name of key. Ex: 'id', or 'name' or etc...
 */
function treeToList(rootNode, nodeKeyName) {
    var stack = [], array = [], hashMap = {}
    var root = rootNode

    //nếu rootNode là array thì convert thành object
    if (Array.isArray(rootNode))
        root = { children: rootNode }

    stack.push(root);

    while (stack.length !== 0) {
        var node = stack.pop();
        var notRoot = node[ nodeKeyName ] && true;

        if (!node.children) {
            visitNode(node, hashMap, array, nodeKeyName);
        } else {
            if (notRoot)
                array.push(node);
            for (var i = node.children.length - 1; i >= 0; i--) {
                node.children[ i ].parentId = node[ nodeKeyName ]
                stack.push(node.children[ i ]);
            }
        }
    }

    return array;
}

export { treeToList }
