const rule = 'docstring-indent'

const availableConfigs = {
  indent: {
    type: 'number',
    defaultValue: 6,
    description: 'Number of spaces required for docstring indentation'
  }
}

function run (feature, file, config = {}) {
  const errors = []
  const requiredSpaces = ' '.repeat(config.indent || 6)

  feature.children.forEach((child) => {
    if (child.scenario) {
      child.scenario.steps.forEach((step) => {
        if (step.docString) {
          const { location, content } = step.docString
          const stepIndent = step.text.match(/^\s*/)[0]
          const expectedIndent = stepIndent + requiredSpaces

          const openingLineNum = location.line
          const closingLineNum = location.line + content.split('\n').length + (content === '' ? 0 : 1) // Adjust for empty docstrings

          if (closingLineNum - 1 < file.lines.length) { // Check if closing line exists
            const openingLine = file.lines[openingLineNum - 1]
            if (!openingLine.startsWith(expectedIndent + '"""')) {
              errors.push({
                message: `Docstring opening """ must be indented ${config.indent} spaces`,
                rule,
                line: openingLineNum
              })
            }

            const closingLine = file.lines[closingLineNum - 1]

            if (!closingLine.startsWith(expectedIndent + '"""')) {
              errors.push({
                message: `Docstring closing """ must match opening indent (${expectedIndent.length} spaces total)`,
                rule,
                line: closingLineNum
              })
            }
          } else {
            errors.push({
              message: 'Missing closing """ for docstring',
              rule,
              line: openingLineNum
            })
          }
        }
      })
    }
  })

  return errors
}

module.exports = {
  name: rule,
  run,
  availableConfigs
}
