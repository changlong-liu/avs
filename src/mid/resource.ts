import { VirtualServerRequest } from './models'
import { getPath, getPureUrl, isNullOrUndefined } from '../common/utils'

export class ResourceNode {
    public children: Record<string, ResourceNode>
    constructor(public name?: string, public url?: string, public body?: string) {
        this.children = {}
    }
}

export class ResourcePool {
    public resourceRoot: ResourceNode
    constructor() {
        this.resourceRoot = new ResourceNode()
    }

    public updateResourcePool(req: VirtualServerRequest) {
        const url = getPureUrl(req.url)
        const path = getPath(url)
        if (req.method == 'PUT') {
            ResourcePool.addResource(
                this.resourceRoot,
                path,
                req.url,
                path[path.length - 1],
                req.body
            )
        }
        if (req.method == 'DELETE') {
            ResourcePool.deleteResource(this.resourceRoot, path)
        }
    }

    public static addResource(
        node: ResourceNode,
        path: string[],
        url: string,
        name: string,
        body: any
    ) {
        if (path.length == 0) {
            node.url = url
            node.name = name
            node.body = body
            return
        }
        const _name = path[0].toLowerCase()
        if (!(_name in node.children)) {
            node.children[_name] = new ResourceNode()
        }
        ResourcePool.addResource(node.children[_name], path.slice(1), url, name, body)
    }

    public hasUrl(req: VirtualServerRequest): boolean {
        const url: string = getPureUrl(req.url) as string
        return !isNullOrUndefined(ResourcePool.getResource(this.resourceRoot, getPath(url)))
    }

    public static isListUrl(req: VirtualServerRequest): boolean {
        const url: string = getPureUrl(req.url) as string
        return url.split('/').slice(1).length % 2 == 1
    }

    public static getResource(node: ResourceNode, path: string[]): ResourceNode | undefined {
        if (path.length == 0) return node
        const name = path[0].toLowerCase()
        if (name in node.children)
            return ResourcePool.getResource(node.children[name], path.slice(1))
        return undefined
    }

    public static deleteResource(node: ResourceNode, path: string[]) {
        if (path.length == 0) return
        const name = path[0].toLowerCase()
        if (name in node.children) {
            if (path.length == 1) {
                delete node.children[name]
            } else {
                ResourcePool.deleteResource(node.children[name], path.slice(1))
            }
        }
    }
}
