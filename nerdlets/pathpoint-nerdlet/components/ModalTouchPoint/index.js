import React from "react";

import { Modal, ResponsiveEmbed } from "react-bootstrap";

import graphImage from "../../images/graph.png";
import startIcon from "../../images/StartIcon.svg";
import startIconOn from "../../images/StartIconOn.svg";
import medalIcon from "../../images/medalIcon.svg";
import medalIconOn from "../../images/medalIconOn.svg";
import closeIcon from "../../images/closeIcon.svg";
import imgOne from "../../images/img1.png";
import { element } from "prop-types";

function ModalWindow(props) {
  let { hidden, _onClose, stageNameSelected, iframembed, viewModal } = props;
  let frame = iframembed[0];

  return (
    <Modal show={hidden} onHide={() => _onClose} backdrop="static">
      <Modal.Body style={{ marginTop: "500px " }}>
        <div
          onClick={() => {
            _onClose();
          }}
          className="closeIcon"
        >
          <img
            style={{
              width: "26px",
              height: "26px",
              zIndex: 5,
              cursor: "pointer",
            }}
            src={closeIcon}
          />
        </div>
        <div class="wrapper">
          {/* <div class="box a">A</div>
                    <div class="box b">B</div>
                    <div class="box c">C</div>
                    <div class="box d">D</div>
                    <div class="box e">E</div>
                    <div class="box f">F</div> */}
          {frame.map((element) => {
            return (
              <div key={element} className="box">
                <iframe
                  src={element}
                  style={{
                    display: "block",
                    height: "400px",
                    width: "600px",
                    border: "none",
                    overflow: "hidden",
                  }}
                ></iframe>
              </div>
              //<iframe className="box" src={element}></iframe>

              // <div style={{ width: '600', height: 'auto', border: '1px solid black' }}>
              //     <ResponsiveEmbed aspectRatio="16by9">
              //         <embed type="text/html" src={element} />
              //     </ResponsiveEmbed>
              // </div>
            );
          })}
        </div>

        {/* <div onClick={() => { _onClose() }} className="closeIcon" >
                        <img
                            style={{
                                width: '26px',
                                height: '26px',
                                zIndex: 5,
                                cursor: 'pointer'
                            }}
                            src={closeIcon}
                        />
                    </div> */}
        {/* <img
                        src={imgOne} style={{ width: '1230px', height: '100%', paddingTop: '50px', padding: '0' }}
                    /> */}
        {/* <div style={{ display: 'grid', gridTemplate: "400px 400px / auto auto", width: '1250px', height: '100%', paddingTop: '50px', padding: '0' }}>

                        {
                            frame.map((element) => {
                                return (
                                    <div style={{ border: '1px solid black'}} className='container-frame'>
                                        <iframe className="responsive-iframe" src={element}></iframe>
                                    </div>
                                    // <div style={{ width: '600', height: 'auto', border: '1px solid black' }}>
                                    //     <ResponsiveEmbed aspectRatio="16by9">
                                    //         <embed type="text/html" src={element} />
                                    //     </ResponsiveEmbed>
                                    // </div>
                                )
                            })
                        }

                    </div> */}
      </Modal.Body>
    </Modal>
  );
}

export default ModalWindow;
