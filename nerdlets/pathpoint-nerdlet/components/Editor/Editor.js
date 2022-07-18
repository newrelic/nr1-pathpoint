// React
import React from 'react';

// Librarys
import PropTypes from 'prop-types';

// Assets
import editorFilters from '../../config/nrql-keywords.json';

const Editor = ({ name, style, value, isReadOnly, onChange, onPressEnter }) => {
  const refBackdrop = React.useRef();
  const refCustomArea = React.useRef();
  const refTextarea = React.useRef();

  // Create object with keyword (property) and color (value)
  const keywords = React.useMemo(() => {
    return editorFilters.keys.reduce((acc, el) => {
      const currentKeys = {};

      // Iterate each filter keyword
      el.keywords.forEach(keyword => {
        // Asign to current keys, the keyword and the respective color
        Object.assign(currentKeys, {
          [keyword]: el.color
        });
      });

      return { ...acc, ...currentKeys };
    }, {});
  }, []);

  /*
    Parse special keywords as '*', add to special keyword the '/' token before the keyword,
    For example { '*': '#000000' } =====> { '\*': '#000000' }
  */
  const parsedKeywords = React.useMemo(() => {
    const keys = Object.keys(keywords); // Get properties from keywords
    const backupKeywords = { ...keywords }; // Create keywords backup

    // Iterate each special character
    editorFilters.specialCharacters.forEach(specialCharacter => {
      // Match any special character prop with any keyword in filters prop
      const existKeyInSpecialCharacters = keys.some(
        key => key === specialCharacter
      );

      // If its match, add to keyword, the '\' token
      if (existKeyInSpecialCharacters) {
        delete backupKeywords[specialCharacter]; // Delete property
        const parsedKey = `\\${specialCharacter}`; // Add '\' token
        backupKeywords[parsedKey] = keywords[specialCharacter]; // Set new property parsed
      }
    });

    return backupKeywords;
  }, []);

  const applyColors = React.useCallback(text => {
    // Define regex for match the NRQL keywords in the text
    const regx = new RegExp(Object.keys(parsedKeywords).join('|'), 'gi');
    // Replace the NRQL keyword with html element
    return text.replace(regx, function(m) {
      const keywordColor = keywords[m.toLowerCase()]; // Get color for set to keyword
      return `<span style="color:${keywordColor}">${m}</span>`; // Return html element
    });
  }, []);

  const updateEditorText = React.useCallback(text => {
    refCustomArea.current.innerHTML = applyColors(text);
  }, []);

  // Event 'onChange' in textarea
  const handleOnInput = React.useCallback(e => {
    updateEditorText(e.target.value);
  }, []);

  // Event 'scroll' in textarea
  const handleOnScroll = React.useCallback(() => {
    refBackdrop.current.scrollTop = refTextarea.current.scrollTop;
  }, [refBackdrop, refTextarea]);

  // Event 'keyDown' for get current key pressed
  const handleOnKeyDown = React.useCallback(e => {
    if (e.keyCode !== 13) return false;

    e.preventDefault();

    const isFunc = typeof onPressEnter === 'function';

    if (!isFunc) return false;

    onPressEnter();
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      updateEditorText(value);
    }

    return () => {
      isMounted = false;
    };
  }, [value]);

  return (
    <div className="nrql-editor" style={style}>
      <textarea
        ref={refTextarea}
        className="entry"
        spellCheck="false"
        autoCorrect="false"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        onInput={handleOnInput}
        onScroll={handleOnScroll}
        onKeyDown={handleOnKeyDown}
        style={
          isReadOnly
            ? { overflow: 'hidden', display: 'none' }
            : { whiteSpace: 'break-spaces' }
        }
      />

      <div ref={refBackdrop} className="backdrop">
        <div
          ref={refCustomArea}
          className="custom-area"
          style={!isReadOnly ? { whiteSpace: 'break-spaces' } : null}
        />
      </div>
    </div>
  );
};

export default React.memo(Editor);

Editor.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func
};
