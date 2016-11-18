class XPathGenerator {
    constructor() {
        this._cache = new Map();
    }

    pathForDOMNode(node) {
        if (node.nodeType == Node.DOCUMENT_NODE)
            return "/";

        return this._path(node);
    }

    _path(node) {
        if (node.nodeType == Node.DOCUMENT_NODE)
            return "";

        if (!node.parentNode)
            return null;

        let cachedResult = this._cache.get(node);
        if (cachedResult)
            return cachedResult;

        if (node.nodeType == Node.TEXT_NODE) {
            let indexOfNode = 0;
            for (let child of node.parentNode.childNodes) {
                if (child.nodeType != Node.TEXT_NODE)
                    continue;

                indexOfNode++;
                if (child == node)
                    break;
            }

            let parentPath = this._path(node.parentNode);
            if (parentPath != null)
                return this._cacheResult(node, `${parentPath}/text()[${indexOfNode}]`);
        }

        if (node.nodeType == Node.ELEMENT_NODE) {
            let indexOfNode = 0;
            for (let child of node.parentNode.childNodes) {
                if (child.tagName !== node.tagName)
                    continue;

                indexOfNode++;
                if (child == node)
                    break;
            }

            let parentPath = this._path(node.parentNode);
            if (parentPath != null)
                return this._cacheResult(node, `${parentPath}/${node.tagName.toLowerCase()}[${indexOfNode}]`);
        }

        return null;
    }

    _cacheResult(node, result) {
        this._cache.set(node, result);
        return result;
    }
}

function nodeAtDOMPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}