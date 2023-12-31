import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/Styles.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function UpdateTimesheet() {
  let selectedEmployeeId; // To add to Timesheets table - EmpId
  let selectedProjectId; // To add to Timesheets table - SowId
  let selectedSubAssignmentId;
  let selectedSubAssignmentName; // To add to Timesheets table - SubAssignment
  let selectedTaskBySubAssignmentName; // To add to Timesheets table - SubAssignmentSegment1
  let newTimesheetRecord = {
    Billable: "",
    EmpId: "",
    FridayHours: "0.00",
    MondayHours: "0.00",
    NonBillableReason: "",
    PeriodStartDate: "",
    SaturdayHours: "0.00",
    SowId: "",
    CompanyName: "",
    SubAssignment: "",
    SubAssignmentSegment1: "",
    SubAssignmentSegment2: "",
    TicketNum: "",
    SundayHours: "0.00",
    ThursdayHours: "0.00",
    TimesheetStatusEntry: "",
    TuesdayHours: "0.00",
    WednesdayHours: "0.00",
  };
  let subAssignmentByProjectArr = [];
  let subAssignmentByProjectFiltered = [];
  let reportingPeriodStartDate = useRef();
  let submittedTimesheetToDBDialogue = useRef();
  let confirmationModalEmployeeName = useRef();
  let mondayHours = useRef();
  let selectedEmployee = useRef();
  let selectedProject = useRef();
  let taskTicketNumber = useRef();
  let [selectedProjectCompanyNameState, setSelectedProjectCompanyNameState] =
    useState("");
  let [selectedProjectSOWIDState, setSelectedProjectSOWIDState] = useState("");
  let [selectedEmployeeIdState, setSelectedEmployeeIdState] = useState(null);
  let [selectedSubAssignmentNameState, setSelectedSubAssignmentNameState] =
    useState("");
  // let [taskBySubAssignmentState, setTaskBySubAssignmentState] = useState("");
  let subAssignmentTask = useRef();
  let subAssignmentTitleDescriptor = useRef();
  let [allTimesheetRecords, setAlllTimesheetRecords] = useState([]);
  let [timesheetRecordsByEmployee, setTimesheetRecordsByEmployee] = useState(
    []
  );
  let [timesheetRecordsToDatabase, setTimesheetRecordsToDatabase] = useState(
    []
  );
  let [currentPrevMonday, setCurrentPrevMonday] = useState(() => {
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - ((todayDate.getDay() + 6) % 7));
    let prevMondayFormat = todayDate.toISOString().split("T")[0];
    return prevMondayFormat;
  }); // To add to Timesheets table - PeriodStartDate
  let [projectAndCompanyInfoArr, setProjectAndCompanyInfoArr] = useState([]);
  let [subAssignmentByProject, setsubAssignmentByProjectArr] = useState([]);
  let [tasksBySubAssignment, setTasksBySubAssignment] = useState([]);
  let [allEmployeesArr, setAllEmployeesArr] = useState([]);

  const getCurrentPrevMonday = () => {
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - ((todayDate.getDay() + 6) % 7));
    console.log(todayDate.toLocaleDateString("en-US"));
    let prevMondayFormat = todayDate.toISOString().split("T")[0];
    console.log(prevMondayFormat);
    return prevMondayFormat;
    // setCurrentPrevMonday(prevMondayFormat);
  };
  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllEmployees = () => {
    fetch("http://localhost:4040/GenericResultBuilderService/buildResults", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _keyword_: "KASH_OPERATIONS_EMPLOYEE_TABLE" }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAllEmployeesArr(res.data);
      })
      .catch((err) => alert("Unable to get users from database.", err));
  };

  const getAllProjects = () => {
    fetch("http://localhost:4040/GenericResultBuilderService/buildResults", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "PROJECTS_AND_COMPANY_INFO_TABLE",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setProjectAndCompanyInfoArr(res.data);
      })
      .catch((err) => alert("Unable to get projects from database.", err));
  };

  const getTimesheetByEmployeeId = (id) => {
    console.log(reportingPeriodStartDate.current.value);
    console.log(id);
    fetch("http://localhost:4040/GenericResultBuilderService/buildResults", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "TIMESHEETS_AND_COMPANY_INFO_TABLE",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        // save all timesheet records to state
        setAlllTimesheetRecords(res.data);
        let filteredTimesheet = res.data.filter((timesheet) => {
          return (
            id === timesheet.EmpId &&
            reportingPeriodStartDate.current.value === timesheet.PeriodStartDate
          );
        });
        console.log(filteredTimesheet);
        setTimesheetRecordsByEmployee(filteredTimesheet);
      })
      .catch((err) => alert(err));
  };

  const changeTimesheetRecordByDate = (id) => {
    console.log("reporting date selected");
    console.log(id);
  };

  const getSelectedEmployeeId = (e) => {
    console.log(selectedEmployee.current.value);
    selectedEmployeeId =
      e.target[e.target.selectedIndex].getAttribute("data-employeeid");
    console.log(selectedEmployeeId);
    setSelectedEmployeeIdState(selectedEmployeeId);
    // fetch timesheets table for selected employee Id and display in table
    getTimesheetByEmployeeId(selectedEmployeeId);
  };

  const getProjectSubCategories = async (projectId) => {
    await fetch(
      "http://localhost:4040/GenericResultBuilderService/buildResults",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _keyword_: "SUB_CATEGORIES_BY_PROJECT_ID",
          SowId: projectId,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        subAssignmentByProjectArr = res.data;
        // setsubAssignmentByProject(res.data);
      })
      .catch((err) => alert(err));
  };

  const getTasksBySubAssignment = async (selectedSubAssignmentId) => {
    console.log(selectedSubAssignmentId);
    await fetch(
      "http://localhost:4040/GenericResultBuilderService/buildResults",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _keyword_: "KASH_OPERATIONS_PROJECT_SUB_CATEGORY_TABLE",
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        let filterTasks = res.data.filter((task) => {
          return selectedSubAssignmentId === task.ProjectSubTaskId;
        });
        console.log(filterTasks);
        setTasksBySubAssignment(filterTasks);
      })
      .catch((err) => alert(err));
  };

  const getSelectedProjectData = async (e) => {
    selectedProjectId =
      e.target[e.target.selectedIndex].getAttribute("data-projectid");
    // console.log(selectedProjectId);
    // console.log(e.target[e.target.selectedIndex].innerHTML);
    let selectedProjectDetails = e.target[e.target.selectedIndex].innerHTML;
    console.log(selectedProjectDetails);
    // Get Company name and save to state
    if (selectedProjectDetails) {
      let selectedProjectCompanyName = selectedProjectDetails.split(" -")[0];
      console.log(selectedProjectCompanyName);
      setSelectedProjectCompanyNameState(selectedProjectCompanyName);
      // Get SOW ID and save to state variable
      let selectedProjectSOWID = selectedProjectDetails.match(/\((.*)\)/).pop();
      console.log(selectedProjectSOWID);
      setSelectedProjectSOWIDState(selectedProjectSOWID);
    }

    // update sub assignments heading to show selected project details
    subAssignmentTitleDescriptor.current.innerHTML = selectedProjectDetails;
    // get sub projects for selected project ID
    await getProjectSubCategories(selectedProjectId);
    console.log(subAssignmentByProjectArr);
    // filter sub assignments to remove duplicates and assign to filtered array
    subAssignmentByProjectFiltered = Object.values(
      await subAssignmentByProjectArr.reduce((c, e) => {
        if (!c[e.SubTaskTitle]) c[e.SubTaskTitle] = e;
        return c;
      }, {})
    );
    setsubAssignmentByProjectArr(subAssignmentByProjectFiltered);
  };

  const selectSubAssignment = (e) => {
    selectedSubAssignmentId =
      e.target[e.target.selectedIndex].getAttribute("data-subprojectid");
    selectedSubAssignmentName = e.target[e.target.selectedIndex].getAttribute(
      "data-subprojectname"
    );
    console.log(
      "selected sub-assignment " +
        selectedSubAssignmentName +
        "-" +
        selectedSubAssignmentId
    );
    // Add sub assignment name to state array
    setSelectedSubAssignmentNameState(selectedSubAssignmentName);

    // query the sub assignments table and filter output by SubTaskTitle to get the list of task areas
    getTasksBySubAssignment(selectedSubAssignmentId);
  };

  const addToStagingSheet = () => {
    console.log(`${selectedEmployeeIdState} 
    ${reportingPeriodStartDate.current.value} 
    ${selectedProjectSOWIDState}
    ${selectedProjectCompanyNameState} 
    ${subAssignmentTask.current.value}
    ${taskTicketNumber.current.value}`);
    if (
      selectedEmployeeIdState &&
      reportingPeriodStartDate.current.value &&
      selectedProjectSOWIDState &&
      selectedProjectCompanyNameState
    ) {
      newTimesheetRecord = {
        Billable: "",
        EmpId: selectedEmployeeIdState,
        FridayHours: "0.00",
        MondayHours: "0.00",
        NonBillableReason: "",
        PeriodStartDate: reportingPeriodStartDate.current.value,
        SaturdayHours: "0.00",
        SowId: selectedProjectSOWIDState,
        CompanyName: selectedProjectCompanyNameState,
        SubAssignment: selectedSubAssignmentNameState,
        SubAssignmentSegment1: subAssignmentTask.current.value,
        SubAssignmentSegment2: "",
        TicketNum: taskTicketNumber.current.value,
        SundayHours: "0.00",
        ThursdayHours: "0.00",
        TimesheetStatusEntry: "",
        TuesdayHours: "0.00",
        WednesdayHours: "0.00",
      };
      console.log("adding new record ", newTimesheetRecord);
      setTimesheetRecordsByEmployee((prevState) => [
        ...prevState,
        newTimesheetRecord,
      ]);
    } else {
      alert("Fill in the ALL of the above fields.");
    }
  };

  // update the timesheet by employee state array when the days of the week are changed in table
  const updateTimesheetRecord = (name, index) => (e) => {
    let newArr = [...timesheetRecordsByEmployee];
    newArr[index][name] = e.target.value;
    setTimesheetRecordsByEmployee(newArr);
  };

  const sendUploadTimesheetToDatabase = async () => {
    console.log(timesheetRecordsByEmployee);
    let currentRecords = timesheetRecordsByEmployee.filter((record) => {
      return Boolean(record.TimesheetEntryId);
    });
    let newRecords = timesheetRecordsByEmployee.filter((record) => {
      return !Boolean(record.TimesheetEntryId);
    });
    await updateCurrentTimesheetRecord(currentRecords);
    await addNewTimesheetRecord(newRecords);
    getTimesheetByEmployeeId(selectedEmployeeIdState);
    showConfirmationModal();
  };

  const updateCurrentTimesheetRecord = async (currentRecordArr) => {
    try {
      const response = await fetch(
        "http://localhost:4040/GenericTransactionService/processTransactionForUpdate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // your expected POST request payload goes here
            data: currentRecordArr,
            _keyword_: "KASH_OPERATIONS_TIMESHEET_TABLE",
            secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
          }),
        }
      );
      const data = await response.json();
      // enter you logic when the fetch is successful
      console.log("Updated record in Timesheets table", data);
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log(error);
      alert("unable to update record");
    }
  };

  const addNewTimesheetRecord = async (newRecordArr) => {
    try {
      const response = await fetch(
        "http://localhost:4040/GenericTransactionService/processTransaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // your expected POST request payload goes here
            data: newRecordArr,
            _keyword_: "KASH_OPERATIONS_TIMESHEET_TABLE",
            secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
          }),
        }
      );
      const data = await response.json();
      // enter you logic when the fetch is successful
      console.log("Added to Timesheets table", data);
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log(error);
      alert("Unable to add record to timesheets table.");
    }
  };

  const deleteTimesheetRow = async (databaseRowId, index) => {
    console.log("deleting row " + databaseRowId);
    console.log(index);
    // If timesheet_entry_id is present, then run a fetch to delete record from database and remove from state array
    // If timesheet_entry_id is not present, the record does not yet exist in database and remove record from state array
    
    if(!window.confirm("Are you sure you want to delete this timesheet record?")) {
      console.log("Confirm delete regected")
      return
    } else {
      let recordsAfterDelete = timesheetRecordsByEmployee.filter((record, i) => {
        return i !== index;
      });
      console.log(recordsAfterDelete);
      setTimesheetRecordsByEmployee(recordsAfterDelete);
  
      if (databaseRowId) {
        console.log("fetch to delete record from timesheets table");
        try {
          const response = await fetch(
            "http://localhost:4040/GenericTransactionService/processTransactionForDelete",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                // your expected POST request payload goes here
                data: [
                  {
                    TimesheetEntryId: databaseRowId,
                  },
                ],
                _keyword_: "KASH_OPERATIONS_TIMESHEET_TABLE",
                secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
              }),
            }
          );
          const data = await response.json();
          // enter you logic when the fetch is successful
          console.log(`Deleted record ${databaseRowId} from timesheets table`);
        } catch (error) {
          // enter your logic for when there is an error (ex. error toast)
          console.log(error);
          alert(`Cound not delete record ${databaseRowId}`);
        }
      }
      getTimesheetByEmployeeId(selectedEmployeeIdState);
    }
    
  };

  const showConfirmationModal = () => {
    confirmationModalEmployeeName.current.innerHTML =
      selectedEmployee.current.value;
    if (
      typeof submittedTimesheetToDBDialogue.current.showModal === "function"
    ) {
      submittedTimesheetToDBDialogue.current.showModal();
    } else {
      alert("Sorry, the <dialog> API is not supported by this browser.");
    }
  };

  return (
    <div>
      <dialog
        className="database-submit-dialog"
        id="database-submit-dialog"
        ref={submittedTimesheetToDBDialogue}
      >
        <form method="dialog">
          <p>
            Timesheet Saved for <br />
            <span
              id="employee-name-span"
              ref={confirmationModalEmployeeName}
            ></span>
          </p>
          <div>
            <button
              className="dialog-modal-confirm-button"
              id="dialog-modal-confirm-button"
              value="confirm"
            >
              OK
            </button>
          </div>
        </form>
      </dialog>

      <main className="timesheet-update__main-section max-width--main-container">
        <h1 className="weeklytimesheet__page-title form-page-title--lg-1">
          Update Weekly Timesheet
        </h1>
        <div className="edit_page__return-link-holder">
          <Link to="/timesheets-hub" className="return-link">
            <svg
              width="80"
              height="134"
              viewBox="0 0 80 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M76.7864 3.36106C72.8812 -0.544183 66.5495 -0.544181 62.6443 3.36106L1.12622 64.8787C-0.0453612 66.0503 -0.0453675 67.9497 1.12621 69.1213L62.6445 130.64C66.5497 134.545 72.8814 134.545 76.7866 130.64C80.6919 126.734 80.6919 120.403 76.7866 116.497L29.4107 69.1216C28.2391 67.95 28.2391 66.0505 29.4107 64.8789L76.7864 17.5032C80.6917 13.598 80.6917 7.2663 76.7864 3.36106Z"
                fill="#255463"
              />
            </svg>
            <p className="return-link-text">Return to Timesheet Hub</p>
          </Link>
        </div>
        <form
          action=""
          id="timesheet-staging-form"
          className="timesheet-staging-form"
        >
          <div className="staging-form__content-holder">
            <div className="timesheet-information-group-holder">
              <div className="employee-input_holder">
                <label
                  htmlFor="employee-dropdown-input"
                  className="employee-dropdown-label"
                >
                  Employee:
                </label>
                <select
                  // onchange="loadTableGen()"
                  className="employee-dropdown-input"
                  id="employee-dropdown-input"
                  name="employee-dropdown-input"
                  onChange={getSelectedEmployeeId}
                  ref={selectedEmployee}
                >
                  <option value="">- Choose an Employee -</option>
                  {allEmployeesArr.map((employee, i) => {
                    return (
                      <option key={i} data-employeeid={employee.EmpId}>
                        {employee.FirstName + " " + employee.LastName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="timesheet__task-category-holder">
                <div className="reporting-date--holder">
                  <label
                    htmlFor="timesheet-update--timesheet-start-date-input"
                    className="reporting-start-date__label"
                  >
                    Reporting Period Start Date (Mon)
                  </label>
                  <input
                    // onchange="loadTableGen()"
                    defaultValue={currentPrevMonday}
                    step={7}
                    type="date"
                    className="add-timesheet-entry--form-input timesheet-update--timesheet-start-date-input"
                    id="timesheet-update--timesheet-start-date-input"
                    name="timesheet-update--timesheet-start-date-input"
                    ref={reportingPeriodStartDate}
                    onChange={() =>
                      getTimesheetByEmployeeId(selectedEmployeeIdState)
                    }
                  />

                  {/* <!--<select name="reporting-start-date__dropdown-input" id="reporting-start-date__dropdown-input" className="reporting-start-date__dropdown-input">-->
                        <!--    <option value="">-->

                        <!--    </option>-->
                        <!--</select>--> */}
                </div>

                <div className="project-description--holder">
                  <label
                    htmlFor="project-description__dropdown-input"
                    className="project-description__label"
                  >
                    Project Description <br />
                    <span>(SOW I.D.)</span>
                  </label>
                  <select
                    name="project-description__dropdown-input"
                    id="project-description__dropdown-input"
                    className="add-timesheet-entry--form-input project-description__dropdown-input"
                    onChange={getSelectedProjectData}
                    ref={selectedProject}
                  >
                    <option value=""></option>
                    {projectAndCompanyInfoArr.map((project, i) => {
                      return (
                        <option key={i} data-projectid={project.SowId}>
                          {project.CompanyName +
                            " - " +
                            project.ProjectCategory +
                            " (" +
                            project.SowId +
                            ")"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="w-10">
                  <div>
                    <label htmlFor="ticket-num">Ticket #</label>
                  </div>
                  <input type="text" id="ticket-num" ref={taskTicketNumber} />
                </div>
                {/* <!--div className="time-billable--holder">
                        <label htmlFor="time-billable__dropdown-input" className="time-billable__label">
                            Time Billable?
                        </label>
                        <select onchange="toggleBillReasonVisibility()" name="time-billable__dropdown-input" id="time-billable__dropdown-input" className="add-timesheet-entry--form-input time-billable__dropdown-input">
                            <option value="Yes">
                                Yes
                            </option>
                            <option value="No">
                                No
                            </option>
                        </select>
                    </div-->

                <div className="non-billable-category--holder">
                  <label
                    htmlFor="non-billable-category__dropdown-input"
                    className="non-billable-category__label"
                  >
                    Non-Billable Category
                  </label>
                  <select
                    name="non-billable-category__dropdown-input"
                    id="non-billable-category__dropdown-input"
                    className="add-timesheet-entry--form-input non-billable-category__dropdown-input"
                  >
                    <option value="n/a">N/A</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Sick or Other PTO">Sick or Other PTO</option>
                    <option value="Travel (Non-billable)">
                      Travel (Non-billable)
                    </option>
                    <option value="Sales">Sales</option>
                    <option value="Client Time (Non-Billable)">
                      Client Time (Non-Billable)
                    </option>
                    <option value="Assigned Admin Project">
                      Assigned Admin Project
                    </option>
                    <option value="General Admin">General Admin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                */}
              </div>
            </div>

            <div className="optional_sub-assignment_holder">
              <div id="sub-assignment-title">
                <p className="sub-assignment_title-text">
                  Project Sub-Assignments
                </p>
                <span
                  id="sub-assignment-title-descriptor"
                  ref={subAssignmentTitleDescriptor}
                ></span>
              </div>
              <div id="sub-assignment-content">
                <div className="w-10">
                  <div>
                    <label htmlFor="sub-assignment">Work Area</label>
                  </div>
                  <select id="sub-assignment" onClick={selectSubAssignment}>
                    <option value=""></option>
                    {subAssignmentByProject.map((subProject, i) => {
                      return (
                        <option
                          key={i}
                          data-subprojectid={subProject.ProjectSubTaskId}
                          data-subprojectname={subProject.SubTaskTitle}
                        >
                          {subProject.SubTaskTitle}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="w-15">
                  <div>
                    <label htmlFor="sub-assignment-seg-1">Task Area</label>
                  </div>
                  <select id="sub-assignment-seg-1" ref={subAssignmentTask}>
                    <option value=""></option>
                    {tasksBySubAssignment.map((subTask, i) => {
                      return <option key={i}>{subTask.Segment1}</option>;
                    })}
                  </select>
                </div>
                {/* <!--div className="w-15">
        				<div><label htmlFor="sub-assignment-seg-2">Segment 2</label></div>
        				<select id="sub-assignment-seg-2">
        					<option value=""></option>
        				</select>
        			</div--> */}


              </div>
            </div>

            <div className="w-5">
                  <div>
                    <div className="addbutton" onClick={addToStagingSheet}>
                      + Add to Sheet
                    </div>
                  </div>
            </div>

            <div className="hours_and_text-status">
              <div className="timesheet__daily-hours-holder">
                <h2 className="daily-hours--title">
                  Daily Hours (Round to nearest 0.25)
                </h2>
                {/* <!---------------------------------------------------------------------YOU ARE WORKING HERE BEGIN ------------------------------------------------------------------------------------------------------->
<!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------> */}
                <div className="table-responsive">
                  <table
                    id="timeSheetTable"
                    className="display table"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th scope="col">Delete</th>
                        <th scope="col">Project</th>
                        <th scope="col">Work Area</th>
                        <th scope="col">Task Area</th>
                        {/* <!--th>Segment 2</th--> */}
                        <th scope="col">Ticket #</th>
                        <th scope="col">Mon</th>
                        <th scope="col">Tue</th>
                        <th scope="col">Wed</th>
                        <th scope="col">Thu</th>
                        <th scope="col">Fri</th>
                        <th scope="col">Sat</th>
                        <th scope="col">Sun</th>
                        <th scope="col">Total Hours</th>
                      </tr>
                    </thead>
                    <tbody id="tabBod">
                      {console.log(timesheetRecordsByEmployee)}
                      {timesheetRecordsByEmployee.map((record, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <FontAwesomeIcon
                                className="delete-timesheet-record"
                                icon={faTrashCan}
                                onClick={() =>
                                  deleteTimesheetRow(record.TimesheetEntryId, i)
                                }
                              />
                            </td>
                            <td>
                              {record.CompanyName} - {record.SowId}
                            </td>
                            <td>{record.SubAssignment}</td>
                            <td>{record.SubAssignmentSegment1}</td>
                            <td>{record.TicketNum}</td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                ref={mondayHours}
                                defaultValue={record.MondayHours}
                                onChange={updateTimesheetRecord(
                                  "MondayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.TuesdayHours}
                                onChange={updateTimesheetRecord(
                                  "TuesdayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.WednesdayHours}
                                onChange={updateTimesheetRecord(
                                  "WednesdayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.ThursdayHours}
                                onChange={updateTimesheetRecord(
                                  "ThursdayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.FridayHours}
                                onChange={updateTimesheetRecord(
                                  "FridayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.SaturdayHours}
                                onChange={updateTimesheetRecord(
                                  "SaturdayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>
                              <input
                                className="weekly-hours-input add-timesheet-entry--form-input hours-input"
                                type="number"
                                min="0"
                                step={0.25}
                                defaultValue={record.SundayHours}
                                onChange={updateTimesheetRecord(
                                  "SundayHours",
                                  i
                                )}
                              />
                            </td>
                            <td>0</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* <!---------------------------------------------------------------------YOU ARE WORKING HERE END ------------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <!--/div>
                <label className="project-status_and_notes--label" htmlFor="project-status_and_notes--input">
                    <p className="project-status_and_notes--label-title">
                        Project Status/Notes:
                    </p>
                    <textarea cols="60" rows="8" className="add-timesheet-entry--form-input project-status_and_notes--input" id="project-status_and_notes--input" name="project-status_and_notes--input"></textarea>
                </label>
            </div>

                <button onclick="sendTimesheetEntryToStaging()" type="button" className="timesheet__add-to-staging-button">
                    Add To Staging Summary
                </button>
            </div--> */}
              </div>
            </div>
          </div>
        </form>

        {/* <!--div className="timesheet__summary-divider">
            <h2 className="projects-summary--title">
                Staging Summary
            </h2>
        </div-->

        <!--iframe src="" title="Weekly Hours Staging Report" id="timesheet-summary_iframe" className="timesheet-summary_iframe"--> */}

        {/* </iframe> */}

        {/* <iframe src="" id="loadTableGenerator" style="display: none"></iframe> */}

        <button
          id="submit-to-database-button"
          type="button"
          onClick={sendUploadTimesheetToDatabase}
          className="submit-timesheet--to-server_button"
        >
          Save Timesheet
          <svg
            className="submit-to-server--embed-arrow"
            width="32"
            height="28"
            viewBox="0 0 32 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.99254e-07 14C3.99254e-07 14.5303 0.210689 15.039 0.58572 15.414C0.960751 15.789 1.4694 15.9996 1.99978 15.9996H25.1692L16.5821 24.5821C16.3962 24.768 16.2487 24.9887 16.1481 25.2316C16.0475 25.4746 15.9957 25.7349 15.9957 25.9978C15.9957 26.2608 16.0475 26.5211 16.1481 26.764C16.2487 27.0069 16.3962 27.2277 16.5821 27.4136C16.7681 27.5995 16.9888 27.747 17.2317 27.8476C17.4747 27.9482 17.735 28 17.998 28C18.2609 28 18.5213 27.9482 18.7642 27.8476C19.0072 27.747 19.2279 27.5995 19.4138 27.4136L31.4125 15.4157C31.5987 15.23 31.7465 15.0093 31.8473 14.7664C31.9481 14.5235 32 14.263 32 14C32 13.737 31.9481 13.4765 31.8473 13.2336C31.7465 12.9907 31.5987 12.77 31.4125 12.5843L19.4138 0.586421C19.0383 0.210942 18.529 0 17.998 0C17.4669 0 16.9577 0.210942 16.5821 0.586421C16.2066 0.9619 15.9957 1.47116 15.9957 2.00217C15.9957 2.53317 16.2066 3.04243 16.5821 3.41791L25.1692 12.0004H1.99978C1.4694 12.0004 0.960751 12.211 0.58572 12.586C0.210689 12.961 3.99254e-07 13.4697 3.99254e-07 14Z"
              fill="white"
            />
          </svg>
        </button>

        {/* <!--button id="submit-for-review-button" type="button" onclick="submitTimesheetForReview()" className="submit-timesheet--to-server_button">
            Submit for Review <svg className="submit-to-server--embed-arrow" width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.99254e-07 14C3.99254e-07 14.5303 0.210689 15.039 0.58572 15.414C0.960751 15.789 1.4694 15.9996 1.99978 15.9996H25.1692L16.5821 24.5821C16.3962 24.768 16.2487 24.9887 16.1481 25.2316C16.0475 25.4746 15.9957 25.7349 15.9957 25.9978C15.9957 26.2608 16.0475 26.5211 16.1481 26.764C16.2487 27.0069 16.3962 27.2277 16.5821 27.4136C16.7681 27.5995 16.9888 27.747 17.2317 27.8476C17.4747 27.9482 17.735 28 17.998 28C18.2609 28 18.5213 27.9482 18.7642 27.8476C19.0072 27.747 19.2279 27.5995 19.4138 27.4136L31.4125 15.4157C31.5987 15.23 31.7465 15.0093 31.8473 14.7664C31.9481 14.5235 32 14.263 32 14C32 13.737 31.9481 13.4765 31.8473 13.2336C31.7465 12.9907 31.5987 12.77 31.4125 12.5843L19.4138 0.586421C19.0383 0.210942 18.529 0 17.998 0C17.4669 0 16.9577 0.210942 16.5821 0.586421C16.2066 0.9619 15.9957 1.47116 15.9957 2.00217C15.9957 2.53317 16.2066 3.04243 16.5821 3.41791L25.1692 12.0004H1.99978C1.4694 12.0004 0.960751 12.211 0.58572 12.586C0.210689 12.961 3.99254e-07 13.4697 3.99254e-07 14Z" fill="white"/>
                </svg>
        </button--> */}

        {/* <iframe
          src=""
          aria-hidden="true"
          title="Submitted Timesheet to Database"
          id="timesheet-to-database-fex--iframe"
          className="timesheet-to-database-fex--iframe"
        ></iframe> */}
      </main>
    </div>
  );
}

export default UpdateTimesheet;
