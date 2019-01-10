import { Task } from './genetic-async'

const options = {
  getRandomSolution: getRandomSolution,   // produces random solution
  popSize: 500,   // population size
  stopCriteria: stopCriteria,   // acts as stopping criteria for entire process
  fitness: fitness,  // measures how good your solution is
  minimize: false,  // whether you want to minimize fitness function. default is `false`, so you can omit it
  mutateProbability: 0.1,  // mutation chance per single child generation
  mutate: mutate,   // implements mutation
  crossoverProbability: 0.3, // crossover chance per single child generation
  crossover: crossover // produces child solution by combining two parents
}

;(async () => {
  const t = new Task(options)
  for (let i = 0; i < 100; i++) {
    try {
      const stats = await t.run()
      console.log('results', stats)
    } catch (e) {
      console.error(e)
    }
  }
})()


function getRandomSolution() {
    return { a: Math.random(), b: Math.random(), c: Math.random() }
}

function fitness(solution) {
  return Math.pow(solution.a,2)+solution.b+solution.c
}

function mutate(solution) {
  if (Math.random()<0.3) {
    solution.a = Math.random()
  }
  if (Math.random()<0.3) {
    solution.b = Math.random()
  }
  if (Math.random()<0.3) {
    solution.c = Math.random()
  }
  return solution
}

function crossover(parent1, parent2) {
  var child = {}
  if (Math.random()>0.5) {
    child.a = parent1.a    
  }
  else {
    child.a = parent2.a
  }
  if (Math.random()>0.5) {
    child.b = parent1.b
  }
  else {
    child.b = parent2.b
  }
  if (Math.random()>0.5) {
    child.c = parent1.c
  }
  else {
    child.c = parent2.c
  }
  return child
}

function stopCriteria() {
  console.log("this.generation = ", this.generation)
  return (this.generation == 10)
}

