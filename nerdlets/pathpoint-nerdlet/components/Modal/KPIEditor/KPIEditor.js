// React
import React from 'react';

// Components
import Editor from '../../Editor/Editor';
import Select from '../../Select/Select';
import SelectIDs from '../../SelectIDs/SelectIDs';

// Librarys
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

// Assets
import iconCopy from '../../../images/icon-copy.svg';
import iconDelete from '../../../images/icon-delete.svg';

// Custom Styles
const inputStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #cdd3d5'
};

const kpiEntryStyle = {
  ...inputStyle,
  maxWidth: 55,
  marginLeft: '1em',
  lineHeight: '40px',
  textAlign: 'center',
  paddingTop: 0,
  paddingBottom: 0
};

// Static data
const kpiTypesAvailables = [
  { label: 'Compare', value: 101 },
  { label: 'Standard', value: 100 }
];

const tableHeaders = [
  { key: 'ms12j', title: 'Name', style: { paddingLeft: 45 } },
  { key: 'nc049', title: 'Short Name' },
  { key: 'o8j5a', title: 'Type' }
];

const tabs = [
  { id: 'tab-01', key: 'tab-query', title: 'Query' },
  { id: 'tab-02', key: 'tab-general', title: 'General' }
];

const kpiValueTypesOptions = [
  { label: 'FLOAT', value: 'FLOAT' },
  { label: 'INT', value: 'INT' }
];

const timerangesButtons = [
  { id: 'as914', index: 0, title: 'DAY', range: 'TODAY' },
  { id: 's1u29', index: 1, title: 'WEEK', range: 'THIS WEEK' },
  { id: 'o12sh', index: 2, title: 'MONTH', range: 'THIS MONTH' },
  { id: '73na8', index: 3, title: 'YDT', range: 'THIS YEAR' }
];

const defaultTimerange = '2 day ago';
const defaultKPILink = 'https://onenr.io/01qwL8KPxw5';
const defaultRegxForAddKPI = /^(New KPI-[0-9]+)$/;
const defaultRegxForTimerange = /(?<=COMPARE WITH ).*/gi;
const defaultRegxForCompareWith = / (COMPARE WITH)(?<=COMPARE WITH)(.*)/gi;
const defaultKPIQuery = 'SELECT count(*) as value FROM Public_APICall';

const defaultKPIValues = {
  check: false,
  accountId: 1,
  name: 'New KPI',
  compareWith: defaultTimerange,
  prefix: '',
  queryByCity: [
    {
      accountID: 1,
      link: defaultKPILink,
      query: defaultKPIQuery
    }
  ],
  shortName: 'NKPI',
  suffix: '',
  type: 101,
  value: 0,
  value_type: 'INT',
  link: defaultKPILink
};

const defaultQueryStatus = {
  goodQuery: true,
  testingNow: false,
  testQueryValue: '',
  testQueryResult: ''
};

const sampleQueries = {
  100: defaultKPIQuery,
  101: defaultKPIQuery
};

const useMounted = (callback, arrDependency = []) => {
  React.useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      callback({ isMounted });
    }

    return () => {
      isMounted = false;
    };
  }, arrDependency);
};

const swapTwoElements = ({ arr, field, value }) => {
  const arrCopy = arr.slice();
  const i = arrCopy.findIndex(el => el[field] === value); // Find current element

  if (i) {
    // Swap position of array elements
    [arrCopy[0], arrCopy[i]] = [arrCopy[i], arrCopy[0]];
  }

  return arrCopy;
};

function isObject(val) {
  return val instanceof Object;
}

function objToString(obj) {
  return Object.entries(obj).reduce((str, [p, val]) => {
    if (isObject(val)) {
      val = objToString(val);
      return `${str}${p}[${val}]\n`;
    } else {
      return `${str}${p}=${val}\n`;
    }
  }, '');
}

export const HeaderKPIEditor = React.memo(() => {
  const DispatchCustomEvent = name => {
    const event = new Event(name, {});
    document.dispatchEvent(event);
  };

  return (
    <div id="kpi-editor-header-modal" style={{ display: 'flex' }}>
      <div className="titleModal">
        <div style={{ display: 'flex', width: '975px' }}>
          {/* Header title */}
          <div style={{ width: '50%' }}>
            <div className="mainHeaderFirstTitle">KPI ´ S</div>
            <div className="mainHeaderSecondTitle">Edit</div>
          </div>

          {/* Header Icons */}
          <div className="icons">
            {/* Duplicate Icon */}
            <HeaderIcon
              title="Duplicate"
              id="DuplicateKPIEditor"
              imgSrc={iconCopy}
              onAction={() => DispatchCustomEvent('DuplicateKPIEditor')}
            />

            {/* Delete Icon */}
            <HeaderIcon
              title="Delete"
              id="DeleteKPIEditor"
              imgSrc={iconDelete}
              onAction={() => DispatchCustomEvent('DeleteKPIEditor')}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const BodyKPIEditor = React.memo(
  ({
    kpis,
    accountId,
    accountIDs,
    timeRangeKpi,
    handleKPIEditorUpdate,
    EditorValidateQuery
  }) => {
    const [formValues, setFormValues] = React.useState(kpis); // Define default form values
    const [currentTab, setCurrentTab] = React.useState(null); // Define default tab
    const [currentKPIIndex, setCurrentKPIIndex] = React.useState(0); // Define default KPI index current KPI actived
    const [timerangeActived, setTimerangeActived] = React.useState(
      timeRangeKpi
    ); // Define default timerange { index: 0, range: 'TODAY' }
    const [queryStatus, setQueryStatus] = React.useState(defaultQueryStatus); // Define default query status when will exists query test on KPI Editor
    const [showConfirmationHeader, setConfirmationHeader] = React.useState(
      false
    ); // Verify if confirmation header needs to show in the KPI editor

    // Verify total KPI
    const existsKPIS = React.useMemo(() => formValues.length > 0, [formValues]);
    // Filter current KPI selected
    const currentKPISelected = React.useMemo(() => {
      return formValues.find(kpi => kpi.index === currentKPIIndex);
    }, [formValues, currentKPIIndex]);

    // Message for Header confirmation
    const HeaderConfirmationMessage = React.useCallback(() => {
      if (!currentKPISelected) return null;

      return (
        <>
          <span style={{ color: '#F44336' }}>You are about to remove</span>
          <span style={{ marginLeft: 4 }}>
            {currentKPISelected.name} ({currentKPISelected.shortName}) with{' '}
            {currentKPISelected.value_type} type
          </span>
        </>
      );
    }, [currentKPISelected]);

    // Query with SINCE AND COMPARE WITH
    const queryMeasure = React.useMemo(() => {
      if (!currentKPISelected) return ''; // Not exist an KPI selected, finalize function
      const { type, compareWith, queryByCity } = currentKPISelected;
      const isKPICompareType = type === 101; // Is a KPI with type 101
      const compareTypeQueryExtend = ` COMPARE WITH ${compareWith}`;

      // When KPI type is 101, concat with COMPARE WITH + timerange (For example: 2 day ago)
      return `${queryByCity[0].query}${
        isKPICompareType ? compareTypeQueryExtend : ''
      } SINCE ${timerangeActived.range}`;
    }, [currentKPISelected, timerangeActived.range]);

    // Show confirmation header
    const handleShowConfirmationHeader = React.useCallback(() => {
      if (!existsKPIS || currentKPIIndex === null) return false;
      setConfirmationHeader(true);
    }, [currentKPIIndex, existsKPIS]);

    // Hide confirmation header
    const handleHideConfirmationHeader = React.useCallback(() => {
      setConfirmationHeader(false);
    }, []);

    // Update timerange actived
    const handleUpdateTimerange = React.useCallback(timerange => {
      setTimerangeActived(timerange);
      setQueryStatus(defaultQueryStatus);
    }, []);

    // Update current accountId
    const handleUpdateAccountId = React.useCallback(
      newAccountId => {
        setQueryStatus(defaultQueryStatus);
        setFormValues(currentState => {
          const formCopy = currentState.slice();

          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex],
            accountId: newAccountId,
            queryByCity: [
              {
                ...formCopy[currentKPIIndex].queryByCity[0],
                accountID: newAccountId
              }
            ]
          };

          return formCopy;
        });
      },
      [currentKPIIndex]
    );

    // Update compareWith property of current KPI selected
    const handleOnChangeCompareWith = React.useCallback(
      newCompareWith => {
        setQueryStatus(defaultQueryStatus); // Reset query status
        setFormValues(currentState => {
          const formCopy = currentState.slice(); // Create array copy

          // Update 'compareWith' field
          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex],
            compareWith: newCompareWith
          };

          return formCopy;
        });
      },
      [currentKPIIndex]
    );

    // Event 'onChange' in Select from KPI type
    const handleOnChangeKPIType = React.useCallback(
      e => {
        setFormValues(currentState => {
          const formCopy = currentState.slice(); // Create array copy

          // When is a KPI 100, the compareWith property is null, and changes to KPI 101, the compareWith property take as value '2 day ago', as default value
          if (formCopy[currentKPIIndex].compareWith === null) {
            formCopy[currentKPIIndex] = {
              ...formCopy[currentKPIIndex],
              compareWith: defaultTimerange
            };
          }

          // Update the 'value_type' property for the current kpi selected
          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex],
            [e.target.name]: e.target.value
          };

          return formCopy;
        });
      },
      [currentKPIIndex]
    );

    const handleUpdateCurrentTab = React.useCallback(newTab => {
      setCurrentTab(newTab); // Change current tab
      setQueryStatus(defaultQueryStatus); // Reset query status
    }, []);

    const handleParseKPIS = React.useCallback(() => {
      return formValues.map(kpi => {
        // Check if current KPI query match with 'COMPARE WITH declaration'
        const existsCompareWithInQuery = kpi.queryByCity[0].query.match(
          defaultRegxForTimerange
        );

        // Define the compareWith property to KPI
        const kpiCompareWith = existsCompareWithInQuery
          ? existsCompareWithInQuery[0]
          : defaultTimerange;

        // Check if KPI accountId exists in accountIds
        const currentAccountId = accountIDs.find(
          el => el.id === kpi.queryByCity[0].accountID
        );

        // Define the KPI accountId
        const defaultAccountId =
          !kpi.queryByCity[0].accountID || !currentAccountId
            ? accountId
            : currentAccountId.id;

        return {
          ...kpi,
          accountId: defaultAccountId,
          link: kpi.queryByCity[0].link,
          compareWith: kpi.type === 101 ? kpiCompareWith : null,
          queryByCity: [
            {
              accountID: defaultAccountId,
              link: kpi.queryByCity[0].link,
              query: kpi.queryByCity[0].query.replace(
                defaultRegxForCompareWith,
                ''
              )
            }
          ]
        };
      });
    }, []);

    // Reset values when change KPI index
    const handleDefaultForm = React.useCallback(() => {
      setCurrentTab('tab-query'); // Reset tab, selecting first tab
      setTimerangeActived(timeRangeKpi); // Reset button selected (DAY, WEEK, etc)
      setQueryStatus(defaultQueryStatus); // Reset query status
    }, []);

    // Uncheck all KPIS when new KPI is added, deleted, or duplicated
    const handleDesactiveAllKPIS = React.useCallback(() => {
      setFormValues(currentState => {
        const formCopy = [...currentState];
        const newFormState = formCopy.map(kpi => ({ ...kpi, check: false }));
        return newFormState;
      });
    }, []);

    // Update KPI index
    const updateCurrentKPIIndex = React.useCallback(
      kpi => {
        setFormValues(currentState => {
          const newFormState = currentState.slice();

          newFormState[kpi.index] = {
            ...newFormState[kpi.index],
            check: true
          };

          const existsKPIInNewFormState = newFormState[currentKPIIndex];

          if (existsKPIInNewFormState) {
            newFormState[currentKPIIndex] = {
              ...newFormState[currentKPIIndex],
              check: false
            };
          }

          return newFormState;
        });

        handleDefaultForm();
        setCurrentKPIIndex(kpi.index);
      },
      [currentKPIIndex]
    );

    // Event 'onChange' in fields
    const handleOnChange = React.useCallback(
      e => {
        setFormValues(currentState => {
          const formCopy = currentState.slice(); // Create copy of current form values

          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex], // Copy the others properties of current KPI selected
            [e.target.name]: e.target.value // Update any 'field' of current KPI selected
          };

          return formCopy; // Return form values updated
        });

        setQueryStatus(defaultQueryStatus);
      },
      [currentKPIIndex]
    );

    // Update query of current KPI selected
    const handleUpdateQuery = React.useCallback(
      e => {
        setFormValues(currentState => {
          const formCopy = [...currentState]; // Create copy of current form values

          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex], // Copy the others properties of current KPI selected
            queryByCity: [
              {
                ...formCopy[currentKPIIndex].queryByCity[0], // Copy the queryByCity property of current KPI selected
                [e.target.name]: e.target.value // Update query
              }
            ]
          };

          return formCopy; // Return form values updated
        });

        setQueryStatus(defaultQueryStatus);
      },
      [currentKPIIndex]
    );

    // Create sample query on KPI Editor
    const handleOnSampleQuery = React.useCallback(() => {
      const query = sampleQueries[currentKPISelected.type];

      setFormValues(currentState => {
        const formCopy = currentState.slice(0); // Create copy of current form values

        formCopy[currentKPIIndex] = {
          ...formCopy[currentKPIIndex], // Copy the others properties of current KPI selected
          queryByCity: [
            {
              ...formCopy[currentKPIIndex].queryByCity[0], // Copy the queryByCity property of current KPI selected
              query: query // New sample query
            }
          ]
        };

        return formCopy; // Return form values updated
      });

      setQueryStatus(defaultQueryStatus);
    }, [currentKPISelected]);

    // Run test query on KPI Editor
    const handleTestQuery = React.useCallback(async () => {
      const { query } = currentKPISelected.queryByCity[0]; // Get query of current KPI selected

      const isEmptyQuery = [query, queryMeasure].includes('');

      if (isEmptyQuery || queryStatus.testingNow) return false; // Verify if query is not empty and not is testing now the query

      setQueryStatus(currentState => ({
        ...currentState,
        testingNow: true // Is testing now the query
      }));

      const kpiType = `KPI-${currentKPISelected.type}`; // Define KPI type

      // Send validation to editor query
      const result = await EditorValidateQuery(
        kpiType,
        queryMeasure,
        currentKPISelected.accountId
      );

      if (!result) return false; // Server doesnt send response, finalize function

      const { testText, goodQuery, testQueryValue } = result; // Get server response

      setQueryStatus({
        goodQuery: goodQuery,
        testQueryResult: testText,
        testQueryValue: testQueryValue,
        testingNow: false
      });
    }, [
      currentKPISelected,
      queryStatus.testingNow,
      timerangeActived.range,
      queryMeasure
    ]);

    // Update query of current KPI selected
    const handleUpdateLink = React.useCallback(
      e => {
        setFormValues(currentState => {
          const formCopy = [...currentState]; // Create copy of current form values

          formCopy[currentKPIIndex] = {
            ...formCopy[currentKPIIndex], // Copy the others properties of current KPI selected
            [e.target.name]: e.target.value, // New link value
            queryByCity: [
              {
                ...formCopy[currentKPIIndex].queryByCity[0], // Copy the queryByCity property of current KPI selected
                [e.target.name]: e.target.value // New link value
              }
            ]
          };

          return formCopy; // Return form values updated
        });

        setQueryStatus(defaultQueryStatus);
      },
      [currentKPIIndex]
    );

    // Event 'submit' in form
    const handleKPIEditorSubmit = React.useCallback(
      e => {
        e.preventDefault();
        const kpisUpdated = formValues.slice();

        kpisUpdated.forEach(kpi => {
          const query =
            kpi.type === 101
              ? [
                  kpi.queryByCity[0].query,
                  'COMPARE WITH',
                  kpi.compareWith
                ].join(' ')
              : kpi.queryByCity[0].query;

          kpi.queryByCity = [
            {
              ...kpi.queryByCity[0],
              query: query
            }
          ];

          delete kpi.accountId;
          delete kpi.compareWith;
        });

        handleKPIEditorUpdate(formValues);
      },
      [formValues, queryMeasure, currentKPIIndex]
    );

    // Add new KPI to current KPIS
    const handleAddKpi = React.useCallback(() => {
      setFormValues(currentState => {
        let indexWithLargestValue = 0; // Define KPI with largest index value
        let filterLastKPICreated = null; // Define last KPI created
        let KPIName = defaultKPIValues.name; // Define initial KPI name
        let KPIShortname = defaultKPIValues.shortName; // Get default KPI shortName

        const lastKPI = currentState.at(-1); // Get last KPI
        const formCopyToReverse = currentState.slice().reverse(); // Flip the KPIS

        // Sort to reverse the KPIS and find the first KPI that match with 'defaultRegxForAddKPI' regx
        for (let i = 0; i < formCopyToReverse.length - 1; i++) {
          const kpi = formCopyToReverse[i]; // Get KPI
          const kpiMatch = kpi.name.match(defaultRegxForAddKPI); // Match the KPI names when only have as name: 'New KPI-HERE_THE_NUMBER'

          if (!kpiMatch) continue; // Skip

          const lastIndex = kpiMatch[0].match(/(?:-)(\d+)$/); // Verify for get the number inside the KPI name, for example: 'New KPI-4' as KPI name return an array where the first position is '-4' and second is the number '4'
          if (!lastIndex) continue; // Skip

          const num = Number(lastIndex[1]); // Get number, 'New KPI-4' ==> '4'

          // Current index is leatest than indexWithLargestValue, update the filterLastKPICreated with the current kpi
          if (indexWithLargestValue < num) {
            filterLastKPICreated = kpi;
            indexWithLargestValue = num;
          }
        }

        if (filterLastKPICreated) {
          const newIndex = filterLastKPICreated.name.match(/(?:-)(\d+)$/); // Get the last number of last KPI created, for example, the last KPI Created is: 'New KPI-8', return 8

          if (newIndex) {
            KPIName = `${KPIName}-${Number(newIndex[1]) + 1}`; // Increment index of last KPI created in name property

            KPIShortname = `${KPIShortname}-${Number(newIndex[1]) + 1}`; // Increment index of last KPI created in shortName property
          }
        } else {
          // Verify if at least one KPI is named as 'New KPI'
          const exitsFirstKPICreated = currentState.some(kpi => {
            return kpi.name === KPIName;
          });

          if (exitsFirstKPICreated) {
            KPIName = `${KPIName}-2`; // Concat 'New KPI' with 2 ==> 'New KPI-2'
            KPIShortname = `${KPIShortname}-2`; // Concat 'NKPI' with 2 ==> 'NKPI-2'
          }

          // The first KPI have an index, for example: 'New KPI-16'
          const firstKPIWithIndexName = currentState.some(kpi => {
            return kpi.name.match(/(?:-)(\d+)$/);
          });

          if (firstKPIWithIndexName) {
            // Update KPI name and shortname, concating with next index. For example: first KPI name is 'New KPI-16', when I creating the new KPI, the second KPI will have as name 'New KPI-17'
            const newIndex = currentState[0].name.match(/(?:-)(\d+)$/);
            KPIName = `${KPIName}-${Number(newIndex[1]) + 1}`;
            KPIShortname = `${KPIShortname}-${Number(newIndex[1]) + 1}`;
          }
        }

        // Define the new KPI
        const newKPI = {
          ...defaultKPIValues,
          name: KPIName,
          shortName: KPIShortname,
          index: !lastKPI ? 0 : lastKPI.index + 1
        };

        return [...currentState, newKPI];
      });

      setCurrentKPIIndex(null);
      handleDesactiveAllKPIS();
    }, [currentKPIIndex]);

    // Duplicate current KPI selected
    const handleDuplicateKPI = React.useCallback(() => {
      if (!existsKPIS || currentKPIIndex === null) return false;

      setFormValues(currentState => {
        const lastKPI = currentState.at(-1); // Get last KPI

        // Define the new duplicated KPI with new index and unchecked
        const newDuplicatedKPI = {
          ...currentKPISelected,
          check: false,
          index: lastKPI.index + 1
        };

        return [...currentState, newDuplicatedKPI];
      });

      setCurrentKPIIndex(null);
      handleDesactiveAllKPIS();
    }, [currentKPISelected, currentKPIIndex, existsKPIS]);

    // Delete current KPI selected
    const handleDeleteKPI = React.useCallback(() => {
      setFormValues(currentState => {
        // Filter KPIS, excluding the KPI with current index
        const newFormState = currentState
          .filter(kpi => {
            return kpi.index !== currentKPISelected.index;
          })
          .map((kpi, i) => ({ ...kpi, index: i })); // Reset KPI indexes

        return newFormState;
      });

      handleDesactiveAllKPIS();
      handleHideConfirmationHeader();
      setCurrentKPIIndex(null);
    }, [currentKPISelected]);

    React.useEffect(() => {
      document.addEventListener('DuplicateKPIEditor', handleDuplicateKPI);
      document.addEventListener(
        'DeleteKPIEditor',
        handleShowConfirmationHeader
      );

      return () => {
        document.removeEventListener('DuplicateKPIEditor', handleDuplicateKPI);
        document.removeEventListener(
          'DeleteKPIEditor',
          handleShowConfirmationHeader
        );
      };
    }, [currentKPISelected]);

    useMounted(() => {
      if (formValues.length > 0) {
        setCurrentTab('tab-query'); // Update tab
        const parsedKPIS = handleParseKPIS();
        setFormValues(parsedKPIS);
      }
    }, []);

    return (
      <div id="kpi-editor-body-modal">
        {/* Header confirmation */}
        {showConfirmationHeader && (
          <HeaderConfirmation
            onConfirm={handleDeleteKPI}
            onCancel={handleHideConfirmationHeader}
            message={<HeaderConfirmationMessage />}
          />
        )}

        {/* Modal content */}
        <div className="modal4content">
          <div className="wrapper">
            {/* Left Content */}
            <section className="left-content">
              <Form onSubmit={handleKPIEditorSubmit}>
                <div style={{ height: 335, maxHeight: 335, overflowY: 'auto' }}>
                  <table style={{ width: '100%' }}>
                    {/* Table Head */}
                    <TableHead />

                    {/* Table Body */}
                    <tbody>
                      {formValues.map(kpi => (
                        <TableCell
                          key={kpi.index}
                          kpi={kpi}
                          handleOnChange={handleOnChange}
                          handleOnChangeKPIType={handleOnChangeKPIType}
                          isActive={currentKPIIndex === kpi.index}
                          updateCurrent={() => updateCurrentKPIIndex(kpi)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div id="kpi-editor-footer-modal" style={{ display: 'flex' }}>
                  {/* Save changes button */}
                  <ActionButton
                    type="submit"
                    title="Save Update"
                    variant="contained"
                    className="save-kpi-changes"
                  />

                  {/* Add KPI button */}
                  <ActionButton
                    position="end"
                    title="+ Add KPI"
                    className="add-new-kpi"
                    variant="outline-primary-primary"
                    onAction={handleAddKpi}
                  />
                </div>
              </Form>
            </section>

            {/* Right Content */}
            <section className="right-content">
              {/* Inputs radio */}
              <div style={{ marginLeft: 10, marginRight: 10 }}>
                {tabs.map(tab => (
                  <Checkbox
                    key={tab.id}
                    tab={tab.key}
                    title={tab.title}
                    currentTab={currentTab}
                    handleUpdateCurrentTab={handleUpdateCurrentTab}
                    disabled={!existsKPIS || currentKPIIndex === null}
                  />
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-container">
                {currentKPISelected && (
                  <>
                    {/* Tab Query */}
                    {currentTab === 'tab-query' && (
                      <TabQuery
                        accountIDs={accountIDs}
                        queryStatus={queryStatus}
                        timeRangeKpi={timerangeActived}
                        currentKpi={currentKPISelected}
                        handleOnChange={handleOnChange}
                        handleOnChangeCompareWith={handleOnChangeCompareWith}
                        handleTestQuery={handleTestQuery}
                        handleOnSampleQuery={handleOnSampleQuery}
                        handleUpdateQuery={handleUpdateQuery}
                        handleUpdateAccountId={handleUpdateAccountId}
                        updateTimeRangeKPI={handleUpdateTimerange}
                      />
                    )}

                    {/* Tab General */}
                    {currentTab === 'tab-general' && (
                      <TabGeneral
                        currentKpi={currentKPISelected}
                        handleOnChange={handleOnChange}
                        handleUpdateLink={handleUpdateLink}
                      />
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
);

BodyKPIEditor.propTypes = {
  kpis: PropTypes.array.isRequired,
  accountId: PropTypes.number.isRequired,
  accountIDs: PropTypes.array.isRequired,
  timeRangeKpi: PropTypes.object.isRequired,
  handleKPIEditorUpdate: PropTypes.func.isRequired,
  EditorValidateQuery: PropTypes.func.isRequired
};

// <------------------------ Extra Components ------------------------>
const HeaderIcon = React.memo(({ id, imgSrc, title, onAction }) => {
  return (
    <div id={id} onClick={onAction} className="icon">
      <img src={imgSrc} alt="header-icon" />
      <p style={{ fontSize: '12px' }}>{title}</p>
    </div>
  );
});

HeaderIcon.propTypes = {
  id: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired
};

const Checkbox = React.memo(
  ({
    title,
    tab,
    currentTab,
    handleUpdateCurrentTab,
    disabled,
    withoutMargin
  }) => {
    // Event 'click' on Checkbox
    const handleCheck = React.useCallback(() => {
      handleUpdateCurrentTab(tab);
    }, []);

    return (
      <>
        <input
          type="radio"
          name="tabs_radio"
          className="select-row-radio-tab"
          disabled={disabled}
          defaultChecked={currentTab === tab}
          onClick={handleCheck}
          style={{
            marginRight: 5,
            transform: 'translateY(7px)'
          }}
        />
        <label
          style={{
            transform: 'translateY(3px)',
            marginRight: withoutMargin ? 0 : 15
          }}
        >
          {title}
        </label>
      </>
    );
  }
);

Checkbox.propTypes = {
  tab: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleUpdateCurrentTab: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  withoutMargin: PropTypes.bool,
  currentTab: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.oneOf([null]).isRequired
  ]).isRequired
};

const ActionButton = React.memo(
  ({ title, position, type = 'button', variant, className, onAction }) => {
    return (
      <div
        style={{
          width: '50%',
          display: 'flex',
          marginTop: 20,
          justifyContent: position === 'end' ? 'flex-end' : 'flex-start'
        }}
      >
        <Button
          type={type}
          variant={variant}
          className={className}
          onClick={onAction}
          color="primary"
        >
          {title}
        </Button>
      </div>
    );
  }
);

ActionButton.propTypes = {
  type: PropTypes.string,
  variant: PropTypes.string,
  position: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func
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

const SuccessfullIcon = () => {
  return (
    <svg
      style={{ marginRight: '3px' }}
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

const QueryResultMessage = ({ message, goodQuery }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {goodQuery ? <SuccessfullIcon /> : <WrongIcon />}
      <span style={{ marginLeft: 2, color: goodQuery ? '#28a32d' : 'red' }}>
        {message}
      </span>
    </div>
  );
};

QueryResultMessage.propTypes = {
  goodQuery: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
};

const HeaderConfirmation = React.memo(({ message, onConfirm, onCancel }) => {
  return (
    <div>
      {/* Header message */}
      <div className="confirm_header" style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%', paddingBottom: 12 }}>
          {/* Message */}
          <div
            style={{
              width: '50%',
              paddingTop: 10,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {message}
          </div>

          {/* Action buttons */}
          <div
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            {/* Confirm button */}
            <Button
              color="primary"
              variant="outline-primary"
              className="btn_confirm"
              onClick={onConfirm}
            >
              Confirm
            </Button>

            {/* Cancel button */}
            <Button
              color="primary"
              variant="outline-primary"
              className="btn_cancel"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Header shadow */}
      <div className="confirm_shadow" style={{ height: '400px' }} />
    </div>
  );
});

HeaderConfirmation.propTypes = {
  message: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const TableHead = React.memo(() => {
  return (
    <thead>
      <tr>
        {tableHeaders.map(tableHeader => (
          <th
            key={tableHeader.id}
            className="headerTableTitle"
            style={{
              textTransform: 'capitalize',
              ...tableHeader.style
            }}
          >
            <span style={tableHeader.titleStyle}>{tableHeader.title}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
});

const TableCell = React.memo(
  ({ kpi, isActive, updateCurrent, handleOnChange, handleOnChangeKPIType }) => {
    const kpiTypesOptions = React.useMemo(() => {
      return swapTwoElements({
        field: 'value',
        value: kpi.type,
        arr: kpiTypesAvailables
      });
    }, []);

    return (
      <tr>
        {/* KPI Name and Checkbox */}
        <td
          style={{
            width: 100,
            backgroundColor: isActive ? '#0078BF' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              defaultChecked={isActive}
              type="radio"
              name="stage_editor"
              className="select-row-radio"
              onClick={updateCurrent}
              style={{ marginTop: 0, marginRight: 15 }}
            />

            {!isActive ? (
              <span>{kpi.name}</span>
            ) : (
              <input
                type="text"
                name="name"
                onChange={handleOnChange}
                defaultValue={kpi.name}
                style={inputStyle}
              />
            )}
          </div>
        </td>

        {/* KPI Shortname */}
        <td
          style={{
            width: 100,
            backgroundColor: isActive ? '#0078BF' : '#ffffff'
          }}
        >
          {!isActive ? (
            <h5>{kpi.shortName}</h5>
          ) : (
            <input
              type="text"
              name="shortName"
              onChange={handleOnChange}
              defaultValue={kpi.shortName}
              style={inputStyle}
            />
          )}
        </td>

        {/* KPI Type */}
        <td
          style={{
            width: 100,
            backgroundColor: isActive ? '#0078BF' : '#ffffff'
          }}
        >
          <div style={{ width: 100 }}>
            <Select
              name="type"
              disabled={!isActive}
              options={kpiTypesOptions}
              handleOnChange={handleOnChangeKPIType}
            />
          </div>
        </td>
      </tr>
    );
  }
);

TableCell.propTypes = {
  kpi: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  updateCurrent: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnChangeKPIType: PropTypes.func.isRequired
};

const tabPropTypes = {
  currentKpi: PropTypes.object,
  handleOnChange: PropTypes.func.isRequired
};

const TabQuery = ({
  currentKpi,
  accountIDs,
  queryStatus,
  timeRangeKpi,
  updateTimeRangeKPI,
  handleOnChangeCompareWith,
  handleUpdateQuery,
  handleUpdateAccountId,
  handleTestQuery,
  handleOnSampleQuery
}) => {
  return (
    <>
      {/* Select Account Type */}
      <div className="select-account-id">
        <h6 style={{ marginRight: 10, color: '#b3b3b3' }}>AccountId</h6>

        <div style={{ width: 150 }}>
          <SelectIDs
            name="accountId"
            options={accountIDs}
            idSeleccionado={currentKpi.accountId}
            handleOnChange={e => handleUpdateAccountId(e.target.value)}
            needUpdateIdSeleccionado
          />
        </div>
      </div>

      {/* Query Editor */}
      <Editor
        name="query"
        style={{ height: 100 }}
        value={currentKpi.queryByCity[0].query}
        onChange={handleUpdateQuery}
        onPressEnter={handleTestQuery}
      />

      {/* Timeranges */}
      <div
        id="kpi-timeranges"
        style={{
          justifyContent: currentKpi.type !== 101 ? 'end' : null
        }}
      >
        {currentKpi.type === 101 && (
          <div className="timerange-entry">
            <span style={{ color: '#b3b3b3' }}>COMPARE WITH</span>
            <input
              name="range"
              value={currentKpi.compareWith}
              onChange={e => handleOnChangeCompareWith(e.target.value)}
              style={{ ...inputStyle, width: 100, marginLeft: '.5em' }}
            />
          </div>
        )}

        <div style={{ width: '50%', display: 'flex' }}>
          {timerangesButtons.map((el, i) => (
            <Button
              key={el.id}
              onClick={() =>
                updateTimeRangeKPI({ index: el.index, range: el.range })
              }
              style={{
                fontSize: 10,
                padding: '1em 2em',
                marginRight: i === timerangesButtons.length - 1 ? 0 : '.4em',
                color: el.index === timeRangeKpi.index ? '#ffffff' : '#293338',
                backgroundColor:
                  el.index === timeRangeKpi.index ? '#000000' : '#e7e9ea'
              }}
            >
              {el.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Query Result */}
      <Editor
        isReadOnly
        style={{ height: 60 }}
        value={
          queryStatus.testQueryValue
            ? objToString(queryStatus.testQueryValue)
            : ''
        }
      />

      {/* Test Query */}
      <div className="test-query">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a onClick={handleOnSampleQuery}>
            <u>Sample Query</u>
          </a>

          <Button
            color="primary"
            variant="outline-primary"
            onClick={handleTestQuery}
            style={{
              marginLeft: 20,
              backgroundColor: '#ffffff',
              border: '1px solid #767b7f'
            }}
          >
            Test
          </Button>
        </div>

        {queryStatus.testQueryResult !== '' && !queryStatus.testingNow && (
          <QueryResultMessage
            goodQuery={queryStatus.goodQuery}
            message={queryStatus.testQueryResult}
          />
        )}

        {queryStatus.testingNow && (
          <span style={{ color: 'blue' }}>Wait please...</span>
        )}
      </div>
    </>
  );
};

TabQuery.propTypes = {
  ...tabPropTypes,
  accountIDs: PropTypes.array.isRequired,
  queryStatus: PropTypes.object.isRequired,
  timeRangeKpi: PropTypes.object.isRequired,
  handleOnChangeCompareWith: PropTypes.func.isRequired,
  handleUpdateQuery: PropTypes.func.isRequired,
  handleUpdateAccountId: PropTypes.func.isRequired,
  handleTestQuery: PropTypes.func.isRequired
};

const TabGeneral = ({ currentKpi, handleOnChange, handleUpdateLink }) => {
  const valueTypes = React.useMemo(() => {
    return swapTwoElements({
      arr: kpiValueTypesOptions,
      field: 'value',
      value: currentKpi.value_type
    });
  }, []);

  return (
    <>
      {/* KPI Prefix */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4 style={{ fontSize: 13 }}>Prefix</h4>
        <input
          name="prefix"
          value={currentKpi.prefix}
          style={kpiEntryStyle}
          onChange={handleOnChange}
        />
      </div>

      {/* KPI Suffix */}
      <div
        style={{ display: 'flex', alignItems: 'center', marginTop: '1.5em' }}
      >
        <h4 style={{ fontSize: 13 }}>Suffix</h4>
        <input
          name="suffix"
          value={currentKpi.suffix}
          style={kpiEntryStyle}
          onChange={handleOnChange}
        />
      </div>

      {/* KPI Value Types */}
      <div
        style={{ display: 'flex', alignItems: 'center', marginTop: '1.5em' }}
      >
        <h4 style={{ fontSize: 13, marginRight: '1em' }}>Value Type</h4>
        <div style={{ width: 150 }}>
          <Select
            name="value_type"
            options={valueTypes}
            handleOnChange={handleOnChange}
          />
        </div>
      </div>

      {/* KPI Link */}
      <div style={{ marginTop: '1.5em' }}>
        <h4 style={{ fontSize: 13 }}>Link</h4>
        <input
          name="link"
          style={inputStyle}
          value={currentKpi.link}
          onChange={handleUpdateLink}
        />
      </div>
    </>
  );
};

TabGeneral.propTypes = {
  ...tabPropTypes,
  handleUpdateLink: PropTypes.func.isRequired
};
