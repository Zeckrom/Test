/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { dummyGraph } from 'shared/dummyGraph'

const nodesStructTransformation = nodes => {
  const newNodes = {}
  nodes.forEach(node => {
    newNodes[node.id] = { ...node, successors: [], dependencies: [] }
  })
  return newNodes
}

const dependenciesStructTransformation = dependencies => {
  const newDependencies = {}
  dependencies.forEach(dependency => {
    newDependencies[dependency.id] = { ...dependency }
  })
  return newDependencies
}

const fillSuccessors = graph => {
  const newGraph = { ...graph }
  const dependenciesId = Object.keys(newGraph.dependencies)
  dependenciesId.forEach(id => {
    const dependency = newGraph.dependencies[id]
    newGraph.nodes[dependency.sourceId].successors = [
      ...newGraph.nodes[dependency.sourceId].successors,
      dependency.targetId,
    ]
  })
  return newGraph.nodes
}

const fillNodesOutgoingDependencies = graph => {
  const newGraph = { ...graph }
  const dependenciesId = Object.keys(newGraph.dependencies)
  dependenciesId.forEach(id => {
    const dependency = newGraph.dependencies[id]
    newGraph.nodes[dependency.sourceId].dependencies.push(id)
  })
  return newGraph.nodes
}

export const newGraphStruct = graph => {
  const newGraph = {
    nodes: nodesStructTransformation(graph.nodes),
    dependencies: dependenciesStructTransformation(graph.dependencies),
  }
  newGraph.nodes = fillSuccessors(newGraph)
  newGraph.nodes = fillNodesOutgoingDependencies(newGraph)
  return newGraph
}

// here we assume we have a graph with nodes with
// with the right structure and filled with their
// successors and dependencies (where the node is
// the source)

export const getSuccessors = (nodeId, dependencies) => {
  const successors = []
  const dependenciesKeys = Object.keys(dependencies)
  for (const dependencyKey of dependenciesKeys) {
    if (dependencies[dependencyKey].sourceId === nodeId) {
      successors.push(dependencies[dependencyKey].targetId)
    }
  }
  return successors
}

export const computeSteps = (nodeId, dependencies) => {
  const successors = getSuccessors(nodeId, dependencies)
  let steps = 0
  for (const succ of successors) {
    steps += computeSteps(succ, dependencies)
  }
  steps += 1
  return steps
}

export const getParents = (nodeId, dependencies) => {
  const parents = []
  const dependenciesKeys = Object.keys(dependencies)
  for (const dependencyKey of dependenciesKeys) {
    if (dependencies[dependencyKey].targetId === nodeId) {
      parents.push(dependencies[dependencyKey].sourceId)
    }
  }
  return parents
}

export const computeIncidence = (nodeId, dependencies) => {
  const successors = getSuccessors(nodeId, dependencies)
  let incidence = 0
  for (const successor of successors) {
    incidence += computeIncidence(successor, dependencies)
  }
  incidence -= 1 + getParents(nodeId, dependencies).length
  return incidence
}

const sortCriteria = (edge1, edge2, dependencies) => {
  if (dependencies[edge1].weight < dependencies[edge2].weight) {
    return -1
  }
  if (dependencies[edge1].weight > dependencies[edge2].weight) {
    return 1
  }
  const steps1 = computeSteps(dependencies[edge1].targetId, dependencies)
  const steps2 = computeSteps(dependencies[edge2].targetId, dependencies)
  if (steps1 < steps2) {
    return -1
  }
  if (steps1 > steps2) {
    return 1
  }
  const incidence1 = computeIncidence(
    dependencies[edge1].targetId,
    dependencies,
  )
  const incidence2 = computeIncidence(
    dependencies[edge2].targetId,
    dependencies,
  )
  if (incidence1 < incidence2) {
    return -1
  }
  if (incidence1 > incidence2) {
    return 1
  }
  const rndNumber = Math.floor(Math.random() + 1)
  return rndNumber === 1 ? 1 : -1
}

const extractSubGraphNodes = (initialNode, graph, newNodes) => {
  if (initialNode.successors.length) {
    initialNode.successors.forEach(successor => {
      extractSubGraphNodes(graph.nodes[successor], graph, newNodes)
    })
  }
  // newNodes.push(initialNode)
  newNodes[initialNode.id] = initialNode
}

const extractSubGraphDependencies = (graph, newNodes) => {
  const dependenciesId = Object.keys(graph.dependencies)
  const dependencies = dependenciesId.filter(id => {
    const dependency = graph.dependencies[id]
    return newNodes[dependency.sourceId] && newNodes[dependency.targetId]
  })

  const result = {}

  dependencies.forEach(el => {
    result[el] = graph.dependencies[el]
  })
  return result
}

export const extractSubGraph = (initialNode, graph) => {
  const newNodes = {}
  extractSubGraphNodes(initialNode, graph, newNodes)
  const newDependencies = extractSubGraphDependencies(graph, newNodes)
  return {
    nodes: newNodes,
    dependencies: newDependencies,
  }
}

const sortDependenciesByKryptonNorms = (nodeId, graph) => {
  const { successors } = graph.nodes[nodeId]
  return successors
    .sort((a, b) => sortCriteria(nodeId + a, nodeId + b, graph.dependencies))
    .map(el => nodeId + el)
}

const traversal = (initialNode, subGraph, newNodes) => {
  const { isVisited } = initialNode
  initialNode.visitCount = initialNode.visitCount
    ? initialNode.visitCount + 1
    : 1
  if (initialNode.isVisited) {
    subGraph.hasDuplicateVisit = true
  } else {
    initialNode.isVisited = true
  }
  if (initialNode.successors.length) {
    const sortedDependenciesIds =
      initialNode.successors.length === 1
        ? [initialNode.id + initialNode.successors]
        : sortDependenciesByKryptonNorms(initialNode.id, subGraph)
    sortedDependenciesIds.forEach(dependency => {
      const node = subGraph.nodes[subGraph.dependencies[dependency].targetId]
      traversal(node, subGraph, newNodes)
    })
  }
  if (!isVisited) newNodes.push(initialNode)
}

export const traversalSimulation = (initialNode, graph) => {
  const structuredGraph = newGraphStruct(graph)
  const subGraph = extractSubGraph(
    structuredGraph.nodes[initialNode.id],
    structuredGraph,
  )
  const newNodes = []
  traversal(structuredGraph.nodes[initialNode.id], subGraph, newNodes)
  return {
    hasDuplicateVisit: subGraph.hasDuplicateVisit,
    nodes: newNodes,
    dependencies: Object.keys(subGraph.dependencies).map(
      key => subGraph.dependencies[key],
    ),
  }
}

const findAncestors = (nodes, dependencies) =>
  dependencies.reduce(
    (acc, dependency) => {
      nodes[0].forEach(node => {
        if (node.id === dependency.target && !node.checked)
          acc[0] = [...acc[0], { checked: false, id: dependency.source }]
      })
      nodes[1].forEach(node => {
        if (node.id === dependency.target && !node.checked)
          acc[1] = [...acc[1], { checked: false, id: dependency.source }]
      })
      return acc
    },
    [[], []],
  )

const validCheck = nodes => nodes.map(node => ({ ...node, checked: true }))

const haveCommonAncestor = (nodeAAncestors, nodeBAncestors) =>
  nodeAAncestors.reduce((acc, ancestor) => {
    if (nodeBAncestors.find(el => !el.checked && el.id === ancestor.id))
      return ancestor
    return acc
  }, false)

export const findLowestCommonAncestor = (
  dependencies,
  nodeAAncestors, // Should be [nodeA] for the first call
  nodeBAncestors, // Should be [nodeB] for the first call
) => {
  const [newNodeAAncestors, newNodeBAncestors] = findAncestors(
    [nodeAAncestors, nodeBAncestors],
    dependencies,
  )
  const commonAncestor = haveCommonAncestor(
    [...nodeAAncestors, ...newNodeAAncestors],
    [...nodeBAncestors, ...newNodeBAncestors],
  )
  if (commonAncestor) return commonAncestor
  if (newNodeAAncestors.length === 0 && newNodeBAncestors.length === 0)
    return false
  return findLowestCommonAncestor(
    dependencies,
    [...validCheck(nodeAAncestors), ...newNodeAAncestors],
    [...validCheck(nodeBAncestors), ...newNodeBAncestors],
  )
}

const populateNodes = (nodesIds, nodes) => nodesIds.map(nodeId => nodes[nodeId])

const populateTree = (node, nodes, completeCount) => {
  node.children = populateNodes(node.successors, nodes)
  let completed = 0
  node.children.forEach(childNode => {
    completeCount += 1
    completed = childNode.state ? completed + 1 : completed
    populateTree(childNode, nodes, completeCount)
  })
  node.completed = completed
  return node
}

export const graphToTree = (graph, entryPoint, completeCount = 0) => {
  const newNodes = nodesStructTransformation(graph.nodes)
  const newDependencies = graph.dependencies.filter(
    d => newNodes[d.source] && newNodes[d.target],
  )
  const simulatedGraph = traversalSimulation(entryPoint, {
    ...graph,
    dependencies: newDependencies,
  })
  const structuredTraversedNodes = newGraphStruct(simulatedGraph)
  const node = populateTree(
    structuredTraversedNodes.nodes[entryPoint.id],
    structuredTraversedNodes.nodes,
    completeCount,
  )
  node.completeCount = completeCount
  return node
}
