// Hooks
import { useMemo, useCallback } from 'react';

// Utils
import { createPriorityStyles } from './utils';

// Images
import clock from '../../../images/clock.svg';
import blackClock from '../../../images/black-clock.svg';

/**
 * Hook that implements the logic of the Issue component
 */
export default function useIssue({ issueId, issueActivated, priority }) {
  // Tag styles
  const tagStyles = useMemo(() => createPriorityStyles(priority), [priority]);

  // Check if issue is activated
  const isActive = useMemo(() => issueId === issueActivated, [
    issueId,
    issueActivated
  ]);

  // Event 'change' image for update src of the image
  const handleChangeImage = useCallback(newImage => {
    return e => {
      const issue = e.target; // Get issue targered
      const clockImage = issue.querySelector('.clock > img'); // Get the clock image inside of each issue

      if (clockImage === null) return; // Tag not exists, stop function
      clockImage.src = newImage; // Update src of the image
    };
  }, []);

  return {
    clock: clock,
    isActive: isActive,
    tagStyles: tagStyles,
    blackClock: blackClock,
    handleMouseLeave: handleChangeImage(clock),
    handleMouseEnter: handleChangeImage(blackClock)
  };
}
