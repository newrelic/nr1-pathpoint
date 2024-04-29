// Data
import colors from './colors.json';

/**
 * Create styles for Tag component in priority base
 * @param {string} pri Item pri
 * @param {object} Object Styles
 */
export function createPriorityStyles(pri) {
  if (typeof pri !== 'string') return {}; // pri is not a string
  if (typeof pri === 'string' && pri === '') return {}; // pri is empty
  const key = pri.toLowerCase(); // Get key field
  const styles = colors[key]; // Get styles ('color' and 'backgroundColor')
  if (typeof styles === 'undefined') return {}; // Styles not exists
  return styles; // Return styles
}
