/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Toast = props => {
  const { toastList, position, autoDelete, autoDeleteTime } = props;
  const [list, setList] = useState(toastList);

  useEffect(() => {
    setList(toastList);
  }, [toastList]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id);
      }
    }, autoDeleteTime);

    return () => {
      clearInterval(interval);
    };
  }, [toastList, autoDelete, autoDeleteTime, list]);

  const deleteToast = id => {
    const listItemIndex = list.findIndex(e => e.id === id);
    const toastListItem = toastList.findIndex(e => e.id === id);
    list.splice(listItemIndex, 1);
    toastList.splice(toastListItem, 1);
    setList([...list]);
  };

  return (
    <>
      <div className={`notification-container ${position}`}>
        {list.map((toast, index) => (
          <div
            key={index}
            className={`notification ${position}`}
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* <button className="" onClick={() => deleteToast(toast.id)}>X</button> */}
            <div className="notification-image">
              <img src={toast.icon} alt="" />
            </div>
            <div className="container-information">
              <div className="notification-stage">Stage: {toast.stage}</div>
              <div className="notification-touchpoint">
                Touchpoint: {toast.touchpoint}
              </div>
              <div className="notification-message">{toast.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
Toast.propTypes = {
  toastList: PropTypes.array.isRequired,
  position: PropTypes.string.isRequired,
  autoDelete: PropTypes.bool,
  autoDeleteTime: PropTypes.number
};
export default Toast;
