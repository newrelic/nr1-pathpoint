import React from "react";

import { Modal } from "react-bootstrap";

import graphImage from "../../images/graph.png";
import startIcon from "../../images/StartIcon.svg";
import startIconOn from "../../images/StartIconOn.svg";
import medalIcon from "../../images/medalIcon.svg";
import medalIconOn from "../../images/medalIconOn.svg";
import closeIcon from "../../images/closeIcon.svg";
import ajv from "ajv";

import Select from "react-select";
import { Button, FormControl, FormGroup } from "react-bootstrap";
import CustomSelect from "./CustomSelect.js";
import play from "../../images/play.svg";
import down from "../../images/down.svg";
import support from "../../images/support.svg";
import setup from "../../images/setup.svg";
import canary from "../../images/CanaryIconBlack.svg";
import flame from "../../images/flame_icon.svg";
import messages from "../../config/messages.json";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import viewSchema, { CustomSchemaValidation } from "../../schemas/view";
import { parseHTML } from "../../config/parseHTML";
import logo_icon_modal from '../../images/logo_icon_modal.svg'

// const configuration = new Configuration();

var NOTEXTAREA = false;

function defaultOptionsSelect() {
  let objeto = [];
  for (const key in messages.configuration.support.options_select_support_02) {
    if (
      Object.hasOwnProperty.call(
        messages.configuration.support.options_select_support_02,
        key
      )
    ) {
      const element =
        messages.configuration.support.options_select_support_02[key];
      objeto.push({
        label: `${element}`,
        value: `${element}`,
      });
    }
  }
  return objeto;
}

const logoTypeOptions = [
  {
    label: 'By URL',
    value: 'url',
  },
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Default',
    value: 'default',
  }
]

import DownloadLink from "react-download-link";

function getConfiguration(configuration) {
  return configuration.getCurrentConfigurationJSON();
}

function getFireSyntheticFilter(configuration, onClose) {
  onClose();
  return configuration.getCurrentHistoricErrorScript();
}

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  message: Yup.string().required("Required"),
});

const logoFormSchema = Yup.object().shape({
  type: Yup.string().required("Required")
});

const handleUploadJSONFile = (e, onClose, configuration, updateNewGui, validateKpiQuery) => {
  const fileReader = new FileReader();
  fileReader.readAsText(e.target.files[0], "UTF-8");
  fileReader.onload = async (eX) => {
    const validator = new ajv({ allErrors: true, async: true });
    const validate = validator.compile(viewSchema);
    const valid = await validate(JSON.parse(eX.target.result));
    if (valid) {
      console.log(validateKpiQuery, 'validateKpiQuery')
      let parsed = JSON.parse(eX.target.result)
      parsed = parsed.banner_kpis
      const queryErrors = []
      for (let i = 0; i < parsed.length; i++) {
        const tested = await validateKpiQuery.validateQuery('Count Query', parsed[i].query)
        if (!tested.goodQuery) {
          queryErrors.push({
            dataPath: `banner_kpis/${i}/query`,
            message: `Bad query structure`
          })
        }
      }
      const customErrors = CustomSchemaValidation(JSON.parse(eX.target.result));
      let totalErrrors = []
      if (!customErrors && queryErrors.length === 0) {
        console.log('ENTRY SET setConfigurationJSON')
        configuration.setConfigurationJSON(eX.target.result, updateNewGui);
      }
      if(customErrors) {
        totalErrrors = [...customErrors]
      }
      if (queryErrors.length > 0) {
        totalErrrors = [...totalErrrors, ...queryErrors]
      }
      if (totalErrrors.length === 0) {
        totalErrrors = false
      }
      onClose(totalErrrors);
    } else {
      onClose(validate.errors);
    }
  };
};

function __body(
  updateNewGui,
  configuration,
  errorsList,
  viewModal,
  stageNameSelected,
  _onClose,
  handleChangeTexarea,
  handleSaveUpdateQuery,
  handleSaveUpdateTune,
  supportForm,
  handleSaveUpdateSupport,
  handleSaveUpdateCanary,
  handleSaveUpdateFire,
  handleChangeTexareaSupport,
  chargueSample,
  querySample,
  testQuery,
  changeSubject,
  testText,
  goodQuery,
  LogoFormSubmit,
  validateKpiQuery
) {
  const defaultOptions = defaultOptionsSelect();
  switch (viewModal) {
    case 0:
      return <img src={graphImage} />;
    case 1:
      let value = stageNameSelected.selectedCase
        ? stageNameSelected.selectedCase.value
        : 0;
      let query_body = stageNameSelected.datos[value].query_body;
      let query_footer = stageNameSelected.datos[value].query_footer;
      return (
        <div
          style={{
            width: "600px",
            paddingTop: "20px",
          }}
        >
          <div>
            <textarea
              value={querySample !== "" ? querySample : query_body}
              onChange={(e) => {
                (NOTEXTAREA = true), handleChangeTexarea(e);
              }}
              style={{
                color: "#00EC64",
                background: "#333333",
                height: "180px",
                border: "1px solid #D0D0D0",
                padding: "15px",
                textAlign: "justify",
              }}
            />
            <strong>{query_footer}</strong>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "30px",
            }}
          >
            <div
              style={{
                width: "40%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <a
                style={{
                  paddingRight: "20px",
                  color: "#767B7F",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  chargueSample(value);
                }}
              >
                Sample Query
              </a>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    background: "white",
                    border: "1px solid #767B7F",
                    boxSizing: "border-box",
                    marginRight: "15px",
                  }}
                  onClick={(e) => {
                    (NOTEXTAREA = false), testQuery(query_body, value);
                  }}
                >
                  Test
                </Button>
              </div>
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                {testText !== "" && (
                  <span
                    style={{
                      color: goodQuery ? "green" : "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {goodQuery ? <SuccessfullIcon /> : <WrongIcon />}
                    {testText}
                  </span>
                )}
              </div>
              <Button
                disabled={
                  NOTEXTAREA
                    ? true
                    : goodQuery === false || goodQuery === null
                    ? true
                    : false
                }
                variant="contained"
                color="primary"
                style={{ background: "#0178bf", color: "white" }}
                onClick={handleSaveUpdateQuery}
              >
                Save / Update
              </Button>
            </div>
          </div>
        </div>
      );
    case 2:
      let error_threshold = stageNameSelected.datos.error_threshold;
      let apdex_time = stageNameSelected.datos.apdex_time;
      return (
        <div style={{ width: "250px", paddingTop: "40px" }}>
          <form onSubmit={handleSaveUpdateTune}>
            <div style={{ height: "40px" }}>
              {" "}
              <input
                id="threshold"
                name="threshold"
                type="text"
                defaultValue={error_threshold}
                className="inputText"
                style={{
                  width: "60px",
                  border: "1px solid gray",
                  padding: "5px",
                }}
              ></input>
              <label
                className="bodySubTitle"
                style={{
                  marginLeft: "10px",
                  textAlign: "right",
                  fontSize: "14px",
                }}
              >
                % Error threshold{" "}
              </label>{" "}
            </div>
            <div style={{ height: "40px" }}>
              {" "}
              <input
                id="apdex"
                name="apdex"
                type="text"
                defaultValue={apdex_time}
                className="inputText"
                style={{
                  width: "60px",
                  border: "1px solid gray",
                  padding: "5px",
                }}
              ></input>
              <label
                className="bodySubTitle"
                style={{ marginLeft: "10px", fontSize: "14px" }}
              >
                % Apdex Min. Score
              </label>{" "}
            </div>

            <div style={{ float: "right", margin: "20px 0px 0px 0px" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ background: "#0178bf", color: "white" }}
              >
                Save / Update
              </Button>
            </div>
          </form>
        </div>
      );
    case 3:
      let error_threshold2 = stageNameSelected.datos.error_threshold;
      return (
        <div style={{ width: "250px", paddingTop: "40px" }}>
          <form onSubmit={handleSaveUpdateTune}>
            <div style={{ height: "40px" }}>
              {" "}
              <label
                className="bodySubTitle"
                style={{ width: "100px", textAlign: "right", fontSize: "14px" }}
              >
                Error threshold{" "}
              </label>{" "}
              <input
                id="threshold"
                name="threshold"
                type="text"
                defaultValue={error_threshold2}
                className="inputText"
                style={{
                  width: "60px",
                  border: "1px solid gray",
                  padding: "5px",
                }}
              ></input>
            </div>
            <div style={{ float: "right", margin: "20px 0px 0px 0px" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ background: "#0178bf" }}
              >
                Save / Update
              </Button>
            </div>
          </form>
        </div>
      );
      break;
    case 4:
      return (
        <div
          style={{
            width: "350px",
            height: "300px",
            paddingTop: "20px",
            display: "grid",
            gridTemplate: "85% 10% / 1fr",
          }}
        >
          <div className="modal4content" style={{ textAlign: "justify" }}>
            {parseHTML(messages.configuration.setup.json)}
            <div>
              <a
                href={messages.configuration.setup.json_link_demo}
                style={{
                  textDecoration: "none",
                  color: "red",
                }}
                target="_blank"
              >
                <YoutubeIcon /> Demo
              </a>
            </div>
          </div>
          <div
            className="modal4content"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div>
                <div>
                  <img src={down} height="15" width="24" />
                  <DownloadLink
                    label="Pathpoint_Json_v1.1"
                    filename="Pathpoint_Json_v1.1.json"
                    className="downloadLink"
                    style={{ cursor: "pointer" }}
                    exportFile={() => getConfiguration(configuration)}
                  />
                </div>
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <label
                htmlFor="file-upload"
                className="buttonUpload"
                color="primary"
              >
                <UploadIcon />
                Update
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={(e) =>
                  handleUploadJSONFile(e, _onClose, configuration, updateNewGui, validateKpiQuery)
                }
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      );
    case 5:
      return (
        <div style={{ width: "350px", height: "40em" }}>
          <div className="modal4content" style={{ textAlign: "justify" }}>
            {messages.configuration.support.message_support_01}
          </div>
          <div className="modal4content space">
            <Formik
              initialValues={{
                subject: "",
                name: "",
                company: "",
                account: "",
                email: "",
                phone: "",
                message: "",
              }}
              validationSchema={contactSchema}
              onSubmit={(values, actions) => handleSaveUpdateSupport(values)}
            >
              {({ errors, touched, submitForm, values, setFieldValue }) => (
                <Form>
                  <Field
                    className="custom-select"
                    name="subject"
                    options={defaultOptions}
                    component={CustomSelect}
                    placeholder="Subject"
                  />
                  {errors.subject && touched.subject && (
                    <div style={{ color: "red" }}>{errors.subject}</div>
                  )}

                  <Field
                    component={renderField}
                    type="text"
                    name="name"
                    onChange={(event) =>
                      setFieldValue("name", event.target.value)
                    }
                    placeholder="Name"
                    bsClass="contact"
                    margin={errors.name && touched.name ? "5px" : "15px"}
                  />
                  {errors.name && touched.name && (
                    <div style={{ color: "red" }}>{errors.name}</div>
                  )}

                  <Field
                    component={renderField}
                    type="company"
                    name="company"
                    onChange={(event) =>
                      setFieldValue("company", event.target.value)
                    }
                    placeholder="Company"
                    bsClass="contact"
                    margin={errors.company && touched.company ? "5px" : "15px"}
                  />
                  {errors.company && touched.company && (
                    <div style={{ color: "red" }}>{errors.company}</div>
                  )}

                  <Field
                    component={renderField}
                    type="account"
                    name="account"
                    onChange={(event) =>
                      setFieldValue("account", event.target.value)
                    }
                    placeholder="Account Name"
                    bsClass="contact"
                    margin={errors.account && touched.account ? "5px" : "15px"}
                  />
                  {errors.account && touched.account && (
                    <div style={{ color: "red" }}>{errors.account}</div>
                  )}

                  <Field
                    component={renderField}
                    type="email"
                    name="email"
                    onChange={(event) =>
                      setFieldValue("email", event.target.value)
                    }
                    placeholder="Email"
                    bsClass="contact"
                    margin={errors.name && touched.name ? "5px" : "15px"}
                  />
                  {errors.email && touched.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}

                  <Field
                    component={renderField}
                    type="number"
                    name="phone"
                    onChange={(event) =>
                      setFieldValue("phone", event.target.value)
                    }
                    placeholder="Mobile"
                    bsClass="contact"
                    margin={errors.phone && touched.phone ? "5px" : "15px"}
                  />
                  {errors.phone && touched.phone && (
                    <div style={{ color: "red" }}>{errors.phone}</div>
                  )}

                  <Field
                    component={renderAreaField}
                    name="message"
                    placeholder="Details"
                    bsClass="contact"
                    value={values.content}
                    margin={errors.phone && touched.phone ? "5px" : "15px"}
                    onChange={(event) =>
                      setFieldValue("message", event.target.value)
                    }
                  />
                  {errors.message && touched.message && (
                    <div style={{ color: "red" }}>{errors.message}</div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{
                        background: "#0178bf",
                        color: "white",
                        width: "45%",
                        marginTop:
                          Object.entries(errors).length > 0 ? "3px" : "20px",
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      );
      break;
    case 6:
      return (
        <div style={{ width: "400px", paddingTop: "20px" }}>
          <form onSubmit={handleSaveUpdateCanary}>
            <div className="modal4content">
              {messages.button_tools.canary.welcome_mat}
            </div>
            <div className="modal4content">
              <div className="modalOptions">
                <div>
                  <a
                    href={messages.button_tools.canary.link_canary}
                    target="_blank"
                  >
                    <img src={play} height="18" /> Demo
                  </a>
                </div>
              </div>
            </div>
            <div
              style={{
                float: "left",
                margin: "20px 15px 0px 0px",
                height: "50px",
              }}
            >
              <span className="touchPointCheckbox">
                <input
                  id="checkbox_canary"
                  name="checkbox_canary"
                  type="Checkbox"
                />
                <label className="checkboxLabel">
                  Do not show this message again.
                </label>
              </span>
            </div>
            <div
              style={{
                float: "right",
                margin: "20px 15px 0px 0px",
                height: "50px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ background: "#0178bf", color: "white" }}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      );
    case 7:
      return (
        <div style={{ width: "400px", paddingTop: "20px" }}>
          <form onSubmit={handleSaveUpdateFire}>
            <div className="modal4content">
              <> {parseHTML(messages.button_tools.flame.welcome_mat)} </>
            </div>
            <div className="modal4content">
              <div className="modalOptions">
                <div>
                  <a
                    href={messages.button_tools.flame.link_flame}
                    target="_blank"
                  >
                    <img src={play} height="18" /> Demo
                  </a>
                </div>
              </div>
            </div>
            <div
              style={{
                float: "left",
                margin: "20px 15px 0px 0px",
                height: "50px",
              }}
            >
              <span className="touchPointCheckbox">
                <input
                  id="checkbox_fire"
                  name="checkbox_fire"
                  type="Checkbox"
                />
                <label className="checkboxLabel">
                  Do not show this message again.
                </label>
              </span>
            </div>
            <div
              style={{
                float: "right",
                margin: "20px 15px 0px 0px",
                height: "50px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ background: "#0178bf", color: "white" }}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      );
    case 8:
      return (
        <div style={{ paddingTop: "30px" }}>
          {errorsList.map((error, i) => {
            return (
              <div className="error-alert-modal" key={i}>
                <p>{`${error.dataPath} - ${error.message}`}</p>
              </div>
            );
          })}
          <div style={{ float: "right", margin: "50px 0px 0px 0px" }}>
            <label htmlFor="file-upload" className="button" color="primary">
              {"Fix & Upload"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={(e) =>
                handleUploadJSONFile(e, _onClose, configuration, updateNewGui, validateKpiQuery)
              }
              style={{ display: "none" }}
            />
          </div>
        </div>
      );
    case 9:
      return (
        <div
          style={{
            width: "400px",
            height: "500px",
            paddingTop: "20px",
            display: "grid",
            gridTemplate: "55% 30% / 1fr",
          }}
        >
          <div className="modal4content" style={{ textAlign: "justify" }}>
            {parseHTML(messages.configuration.setup.background)}
            <div>
              <a
                href={messages.configuration.setup.background_link}
                target="_blank"
              >
                Click here
              </a>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              paddingRight: "15px",
              paddingLeft: "15px",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
            }}
          >
            {/* <div>
                            <img src={down} height="15" width="24" />
                            <DownloadLink
                                label="Drop filter"
                                // filename="Pathpoint_Json_v1.1.json"
                                className="downloadLink"
                                style={{ cursor: "pointer" }}
                                exportFile={() => alert('Download drop filter')}
                            />
                        </div> */}
            <div>
              <img src={down} height="15" width="24" />
              <DownloadLink
                label="Fire filter"
                filename="FireSyntheticFilter.js"
                className="downloadLink"
                style={{ cursor: "pointer" }}
                exportFile={() =>
                  getFireSyntheticFilter(configuration, _onClose)
                }
              />
            </div>
          </div>
        </div>
      );
    case 10:
      return (
        <div style={{ width: "350px" }}>
          <div className="modal4content space form-parent-container">
            <Formik
              initialValues={{
                type: "url",
                url: "",
                text: ""
              }}
              validationSchema={logoFormSchema}
              onSubmit={(values, actions) => LogoFormSubmit(values, _onClose)}
            >
              {({ errors, touched, submitForm, values, setFieldValue }) => (
                <Form>
                  <Field
                    className="custom-select"
                    name="type"
                    options={logoTypeOptions}
                    component={CustomSelect}
                    placeholder=""
                  />
                  {
                    values.type === 'Text' &&
                    <div style={{ marginTop: '6px' }}>
                      <span style={{
                        color: '#BDBDBD'
                      }}>
                        28 characters limit
                      </span>
                      <Field
                        component={renderField}
                        type="text"
                        name="name"
                        onChange={(event) =>
                          setFieldValue("text", event.target.value)
                        }
                        placeholder="Enter Text"
                        bsClass="contact"
                        margin={errors.name && touched.name ? "5px" : "15px"}
                      />
                    </div>
                  }
                  {
                    values.type !== 'Text' && values.type !== 'Default' &&
                    <div style={{ marginTop: '6px' }}>
                      <span style={{
                        color: '#BDBDBD'
                      }}>
                        Dimensions 45 x 27
                      </span>
                      <Field
                        component={renderField}
                        type="text"
                        name="name"
                        onChange={(event) =>
                          setFieldValue("url", event.target.value)
                        }
                        placeholder="Enter URL"
                        bsClass="contact"
                        margin={errors.name && touched.name ? "5px" : "15px"}
                      />
                    </div>
                  }
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: '20px'
                  }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{
                        background: "#0178bf",
                        color: "white",
                        width: "45%",
                        marginTop:
                          Object.entries(errors).length > 0 ? "3px" : "20px",
                      }}
                    >
                      Save Update
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )
  }
}

function __header(viewModal, stageNameSelected, _onClose, changeMessage) {
  switch (viewModal) {
    case 0:
      return (
        <div className="headerModal">
          {stageNameSelected.icon_description === "medal" ? (
            <div style={{ display: "flex" }}>
              <img
                style={{
                  width: "26px",
                  height: "26px",
                  marginLeft: "5px",
                }}
                src={stageNameSelected.icon_active ? medalIconOn : medalIcon}
              />
              <div className="titleModal">{stageNameSelected.title}</div>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <img
                style={{
                  width: "26px",
                  height: "26px",
                  marginLeft: "5px",
                }}
                src={stageNameSelected.icon_active ? startIconOn : startIcon}
              />
              <div className="titleModal">{stageNameSelected.title}</div>
            </div>
          )}
          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 1:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal" style={{ width: "290px" }}>
              {stageNameSelected.touchpoint.value}
            </div>
            <div>
              <Select
                onChange={(e) => {
                  changeMessage(e, stageNameSelected);
                }}
                placeholder={stageNameSelected.datos[0].label}
                isSearchable={false}
                classNamePrefix="react-selectQuery"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                })}
                // classNamePrefix="react-select"
                options={stageNameSelected.datos}
              />
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 2:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              {stageNameSelected.touchpoint.value}
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 3:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              {stageNameSelected.touchpoint.value}
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 4:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={setup} width="18" /> Setup : Json Configuration
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 5:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={support} height="18" /> Support
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 6:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={canary} width="18" /> Canary
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
    case 7:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={flame} height="15" width="15" /> Flame
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
      break;
    case 8:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <p className="error-modal-title">
                Your view configuration file has some errors, please try again
              </p>
            </div>
          </div>
          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
    case 9:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={setup} width="18" /> Setup: Background Processes
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
    case 10:
      return (
        <div className="headerModal">
          <div style={{ display: "flex" }}>
            <div className="titleModal">
              <img src={logo_icon_modal} height="18" /> Logo
            </div>
          </div>

          <div
            className="selectIcon"
            onClick={() => {
              _onClose();
            }}
          >
            <img
              style={{
                width: "26px",
                height: "26px",
              }}
              src={closeIcon}
            />
          </div>
        </div>
      );
  }
}

function ModalWindow(props) {
  let {
    chargueSample,
    querySample,
    testQuery,
    changeSubject,
    updateNewGui,
    configuration,
    hidden,
    errorsList,
    _onClose,
    stageNameSelected,
    viewModal,
    changeMessage,
    handleChangeTexarea,
    handleSaveUpdateQuery,
    handleSaveUpdateTune,
    supportForm,
    handleSaveUpdateSupport,
    handleSaveUpdateCanary,
    handleSaveUpdateFire,
    handleChangeTexareaSupport,
    testText,
    goodQuery,
    LogoFormSubmit,
    validateKpiQuery
  } = props;

  return (
    <Modal
      show={hidden}
      onHide={() => _onClose}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body>
        <div className="containModal">
          {__header(viewModal, stageNameSelected, _onClose, changeMessage)}

          <div style={{ width: "100%", height: "100%" }}>
            {__body(
              updateNewGui,
              configuration,
              errorsList,
              viewModal,
              stageNameSelected,
              _onClose,
              handleChangeTexarea,
              handleSaveUpdateQuery,
              handleSaveUpdateTune,
              supportForm,
              handleSaveUpdateSupport,
              handleSaveUpdateCanary,
              handleSaveUpdateFire,
              handleChangeTexareaSupport,
              chargueSample,
              querySample,
              testQuery,
              changeSubject,
              testText,
              goodQuery,
              LogoFormSubmit,
              validateKpiQuery
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const renderAreaField = ({ onChange, placeholder, bsClass, margin }) => {
  return (
    <FormControl
      bsClass={bsClass}
      style={{ marginTop: "15px" }}
      onChange={onChange}
      componentClass="textarea"
      placeholder={placeholder}
      style={{ marginTop: margin, borderRadius: 0 }}
    />
  );
};

const renderField = ({ onChange, placeholder, type, bsClass, margin }) => {
  return (
    <FormControl
      style={{ marginTop: margin, borderRadius: 0 }}
      bsClass={bsClass}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
};

const UploadIcon = () => {
  return (
    <svg
      style={{ marginRight: "5px" }}
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.063 1.55078L0.74664 3.95719C0.576005 4.13446 0.298613 4.13446 0.127977 3.95719C-0.0426587 3.77992 -0.0426587 3.49175 0.127977 3.31448L3.19067 0.132723C3.27555 0.0445439 3.38756 -1.26948e-06 3.49956 -1.25969e-06C3.61157 -1.2499e-06 3.72358 0.0445439 3.80933 0.132724L6.87202 3.31448C7.04266 3.49175 7.04266 3.77992 6.87202 3.95719C6.70139 4.13446 6.424 4.13446 6.25336 3.95719L3.93806 1.55265L3.93806 9.54546C3.93806 9.79637 3.74204 10 3.50053 10C3.25901 10 3.063 9.79637 3.063 9.54546L3.063 1.55078Z"
        fill="white"
      />
    </svg>
  );
};

const YoutubeIcon = () => {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8963 2.58956L13.8969 2.59621C13.9011 2.64496 13.9999 3.80284 14 4.96538V6.05213C14 7.21466 13.9011 8.37255 13.8969 8.4213L13.8953 8.43615C13.8817 8.55039 13.7474 9.56788 13.2833 10.0912C12.7264 10.7268 12.0984 10.796 11.7964 10.8292L11.7962 10.8293C11.7673 10.8324 11.7411 10.8352 11.7177 10.8385L11.6932 10.8411C9.84239 10.9807 7.04737 10.9998 7.01939 10.9999L7.01511 11L7.01084 10.9999C6.86878 10.9978 3.51824 10.9458 2.4496 10.8403L2.41723 10.8357C2.38467 10.8297 2.33732 10.8241 2.28228 10.8176L2.27785 10.8171C1.91768 10.7743 1.24808 10.6947 0.718516 10.0935C0.233488 9.56445 0.115569 8.54374 0.103713 8.42872L0.102966 8.42141C0.0987999 8.37266 0 7.21466 0 6.05213V4.96538C0 3.80284 0.0987999 2.64485 0.102966 2.59621L0.104568 2.58136C0.118346 2.46701 0.252501 1.44951 0.716593 0.926306C1.28141 0.28177 1.91309 0.206092 2.21664 0.169749C2.2209 0.169234 2.2251 0.168729 2.22924 0.168232C2.24823 0.16595 2.26591 0.163824 2.28222 0.16155L2.3069 0.15889C4.17438 0.0192796 6.96951 0.000221604 6.99749 0.000110802L6.99995 0L7.0024 0.000110802C7.03039 0.000221604 9.82552 0.0192796 11.6763 0.15889L11.7008 0.16155C11.7216 0.16443 11.7449 0.167201 11.7703 0.170192C12.0774 0.206425 12.7159 0.281992 13.2791 0.904035C13.7664 1.43289 13.8844 2.47266 13.8963 2.58956ZM13.0804 8.33798C13.0889 8.23626 13.1795 7.12813 13.1795 6.05213V4.96538C13.1795 3.87198 13.0862 2.74834 13.08 2.67576C13.0451 2.34413 12.9076 1.73162 12.6855 1.49151L12.6822 1.48785C12.3247 1.09229 11.9351 1.04619 11.6774 1.01572L11.676 1.01555C11.6506 1.01251 11.6269 1.00969 11.6052 1.00686C9.80512 0.871903 7.09714 0.851737 6.99995 0.851072L6.99625 0.851101C6.84867 0.85226 4.17566 0.873252 2.37761 1.00686C2.35871 1.0094 2.33838 1.01184 2.31669 1.01445L2.31074 1.01517C2.06016 1.0452 1.68131 1.09063 1.322 1.50059C1.10528 1.74502 0.961083 2.34978 0.919533 2.67986C0.910775 2.78368 0.820413 3.8906 0.820413 4.96538V6.05213C0.820413 7.1432 0.913338 8.2644 0.919854 8.3413C0.954781 8.6664 1.09225 9.26838 1.31441 9.50849L1.322 9.51691C1.64474 9.88518 2.06445 9.93507 2.37109 9.97152L2.3712 9.97153C2.43165 9.97863 2.48901 9.9855 2.54209 9.99447C3.57816 10.0943 6.87968 10.1467 7.01864 10.1488C7.14254 10.148 9.83214 10.1274 11.6223 9.99314C11.6488 9.98971 11.678 9.98638 11.7097 9.98295C11.9711 9.95425 12.3293 9.9148 12.6779 9.51691C12.904 9.26196 13.0455 8.6182 13.0804 8.33798ZM6.06198 3.09471L9.1549 4.85026C9.33797 4.95419 9.45119 5.15308 9.45044 5.36948C9.44959 5.58587 9.33498 5.78388 9.15137 5.88637L6.05835 7.61167C5.97343 7.65909 5.88115 7.68269 5.78908 7.68269C5.68857 7.68269 5.58828 7.65455 5.49781 7.59848C5.32456 7.49112 5.22117 7.30198 5.22117 7.09267V3.61171C5.22117 3.40141 5.3252 3.21194 5.49962 3.10468C5.67394 2.99753 5.88414 2.99377 6.06198 3.09471ZM6.04158 4.05315V6.65478L8.35318 5.36527L6.04158 4.05315Z"
        fill="#FF4C4C"
      />
    </svg>
  );
};
const SuccessfullIcon = () => {
  return (
    <svg
      style={{ marginRight: "3px" }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1642 5.28537C11.4005 5.52163 11.4005 5.90462 11.1642 6.14077L7.10662 10.1985C6.87035 10.4346 6.48749 10.4346 6.25122 10.1985L4.31963 8.2668C4.08337 8.03065 4.08337 7.64767 4.31963 7.41152C4.55578 7.17525 4.93877 7.17525 5.17491 7.41152L6.67886 8.91546L10.3088 5.28537C10.5451 5.04922 10.9281 5.04922 11.1642 5.28537ZM15.4839 7.74194C15.4839 12.0213 12.0207 15.4839 7.74194 15.4839C3.46258 15.4839 0 12.0207 0 7.74194C0 3.46258 3.46317 0 7.74194 0C12.0213 0 15.4839 3.46317 15.4839 7.74194ZM14.2742 7.74194C14.2742 4.13121 11.3522 1.20968 7.74194 1.20968C4.13121 1.20968 1.20968 4.13169 1.20968 7.74194C1.20968 11.3527 4.13169 14.2742 7.74194 14.2742C11.3527 14.2742 14.2742 11.3522 14.2742 7.74194Z"
        fill="#219653"
      />
    </svg>
  );
};

const WrongIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4839 7.74194C15.4839 12.0213 12.0207 15.4839 7.74194 15.4839C3.46258 15.4839 0 12.0207 0 7.74194C0 3.46258 3.46317 0 7.74194 0C12.0213 0 15.4839 3.46317 15.4839 7.74194ZM14.2742 7.74194C14.2742 4.13121 11.3522 1.20968 7.74194 1.20968C4.13121 1.20968 1.20968 4.13169 1.20968 7.74194C1.20968 11.3527 4.13169 14.2742 7.74194 14.2742C11.3527 14.2742 14.2742 11.3522 14.2742 7.74194Z"
        fill="#FF4C4C"
      />
      <path
        d="M10.7806 9.7212L8.55942 7.50001L10.7806 5.27882C11.0731 4.98629 11.0732 4.51199 10.7806 4.21942C10.488 3.92686 10.0137 3.9269 9.72125 4.21942L7.50003 6.44061L5.2788 4.21942C4.98631 3.92686 4.51193 3.92686 4.21941 4.21942C3.92688 4.51199 3.92688 4.98629 4.21944 5.27882L6.44063 7.50001L4.21944 9.7212C3.92688 10.0138 3.92684 10.4881 4.21941 10.7806C4.51205 11.0732 4.98635 11.0731 5.2788 10.7806L7.50003 8.5594L9.72125 10.7806C10.0137 11.0731 10.4881 11.0732 10.7806 10.7806C11.0732 10.488 11.0732 10.0137 10.7806 9.7212Z"
        fill="#FF4C4C"
      />
    </svg>
  );
};

export default ModalWindow;
