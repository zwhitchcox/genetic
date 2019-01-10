export class Task {
  constructor(options) {
    Object.assign(this, {
      generation: 0,
      popSize: 10,
      minimize: false,
    }, options)
  }

  async run() {
    this.population = []
    await this.init()
    await this.loop()
    return this.statistics
  }

  async init() {
    while (this.population.length !== this.popSize) {
      await (async () => {
        const solution = this.getRandomSolution()
        this.population.push(solution)
      })()
    }
  }

  async loop() {
    while (!this.stopCriteria()) {
      await this.iteration()
    }
  }

  async iteration() {
    this.generation++
    await this.calcFitness()
    this.parents = (await copyArrayAsync(this.population))
    await this.reproduction()
    this.population = await copyArrayAsync(this.children)
  }

  async calcFitness() {
    for (const item of this.population) {
      item.score =  await this.fitness(item)
    }
  }

  async reproduction() {
    let avg, min, sum = 0
    const { parents } = this
    let max = min = parents[0]
    this.children = []
    for (const item of parents) {
      await (async () => {
        sum += item.score
        if (item.score > max.score) {
          max = item
        }
        if (item.score < min.score) {
          min = item
        }
      })()
    }
    //if (this.minimize) {
      //for (const item of parents) {
        //await (async () => {
          //item.score*=-1
          //sum*=-1
          //item.score+=maxScore
        //})()
      //}
    //}
    this.statistics = {
      minScore: min.score,
      maxScore: max.score,
      min: copy(min),
      max: copy(max),
      avg: sum / this.popSize
    }
    if (this.sort) {
      parents
        .sort((a, b) => b.score - a.score)
    }
    let child
    while(this.children.length < this.popSize) {
      const parent1 = await this.getParent(sum)
      await (async () => {
        child = copy(parent1)
        if (Math.random() < this.crossoverProbability) {
          const parent2 = await this.getParent(sum)
          child = this.crossover(parent1, parent2)
        }
        if (Math.random() < this.mutateProbability) {
          this.children.push(this.mutate(child))
        } else {
          this.children.push(child)
        }
      })()
    }
  }

  async getParent(sum) {
    const point = Math.random()*sum
    let position = 0
    let level = this.parents[position].score
    await (async () => {
      while (level < point) {
        position++
        level += this.parents[position].score
      }
    })()
    return copy(this.parents[position])
  }
}

async function copyArrayAsync(arr) {
  const newArr = []
  for (const item of arr) {
    await (async () => {
      newArr.push(item)
    })()
  }
  return newArr
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

