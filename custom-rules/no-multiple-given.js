const rule = 'no-multiple-given'

function run (feature) {
  const errors = []

  feature.children.forEach((child) => {
    if (child.scenario) {
      const scenario = child.scenario
      let givenCount = 0
      let lastGivenLine = 0

      scenario.steps.forEach((step) => {
        if (step.keyword === 'Given ') {
          givenCount++
          lastGivenLine = step.location.line
        }
      })

      if (givenCount > 1) {
        errors.push({
          message: 'Scenario should contain only one Given step',
          rule,
          line: lastGivenLine,
          description: `Found ${givenCount} Given steps in this scenario`
        })
      }
    }
  })

  return errors
}

module.exports = {
  name: rule,
  run
}
