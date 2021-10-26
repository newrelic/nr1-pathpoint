const STAGEWITH = 250;

/**
 * Calculate container size
 *
 * @export
 * @return {object} Style
 */
export function mainContainerStyle() {
  return { gridTemplate: '60px 1fr / auto' };
}

/**
 * Calculate number of grids
 *
 * @export
 * @param {number} numStages Number of stages
 * @return {object} Style
 */
export function contentStyle(numStages) {
  const unit = 100 / numStages;
  let columns = '';
  for (let index = 0; index < numStages; index++) {
    columns = `${columns} ${unit}%`;
  }
  return {
    display: 'grid',
    gridTemplateColumns: columns
    // gridTemplateRows: "200px",
  };
}

/**
 * Calculate the space on the sides
 *
 * @export
 * @param {number} numStages Number of stages
 * @return {object} Style
 */
export function contentContainerStyle(numStages) {
  if (numStages <= 5) {
    return { paddingLeft: '5%', paddingRight: '5%' };
  } else {
    /* istanbul ignore next */
    return {
      paddingLeft: '1%',
      paddingRight: '1%'
    };
  }
}

/**
 * Calculate the size of the content and if it has a border
 *
 * @export
 * @param {string} active_dotted Enable stippling
 * @param {string} active_dotted_color Dotted color
 * @return {object} Style
 */
export function mainColumn(active_dotted, active_dotted_color) {
  return {
    width: `${STAGEWITH}px`,
    height: '100%',
    borderLeftStyle: active_dotted,
    color: active_dotted_color,
    borderWidth: '1px'
  };
}
