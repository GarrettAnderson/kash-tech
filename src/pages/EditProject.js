import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Link, useAsyncError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/Styles.css";
import AddSubCategoryForm from "../components/AddSubCategoryForm";
import ProjectSubCategory from "../components/ProjectSubCategory";
import SaveNewSubCategory from "../components/SaveNewSubCategory";


function EditProject() {
  let companyName = useRef();
  let newWorkAreaInput = useRef();
  let newWorkAreaIdInput = useRef();
  let confirmationModal = useRef();
  let projectDescription = useRef();
  let subCategoryContainer = useRef();
  let editAddSubCat = useRef();
  let [selectedCompanyIdState, setSelectedCompanyIdState] = useState();
  let subCategoriesByProject = [];
  let allTasksBySubCategory = [];
  let [selectedCompanyName, setSelectedCompanyName] = useState("");
  let [showNewSubCategory, setShowCreateNewSubCategory] = useState(false);
  let [createBtnDisabled, setCreateBtnDisabled] = useState(true)
  let [selectedProjectSowIdState, setSelectedProjectSowIdState] = useState();
  let [subCategoriesByProjectState, setSubCategoriesByProjectState] = useState([]);
  let [allCompaniesRemoveDuplicateArr, setAllCompaniesRemoveDuplicateArr] = useState([]);
  let [allProjectsByCompany, setAllProjectsByCompany] = useState([]);
  let [allSubCategories, setAllSubCategories] = useState([]);
  let [consolidatedSubCategories, setConsolidatedSubCategories] = useState([]);
  let [allCompaniesProjectsArr, setAllCompaniesProjectsArr] = useState([]);
  let requiredInputs = [companyName, projectDescription, newWorkAreaInput, newWorkAreaIdInput];

  //   on page load, fetch companies from DB
  useEffect(() => {
    console.log("use effect to get all companies")
    getAllCompaniesProjects();
    getProjectAndSubcategories()
  }, [])

  useEffect(() => {
    console.log("Use effect to get all projects and subcategories", selectedCompanyIdState)
    getProjectsByCompany(selectedCompanyIdState)
  }, [selectedCompanyName])

  const getAllCompaniesProjects = async () => {
    await fetch("http://localhost:4040/GenericResultBuilderService/buildResults", {
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
        setAllCompaniesProjectsArr(res.data)
        let removeDuplicateCompany = Object.values(
          res.data.reduce((c, e) => {
            if (!c[e.CompanyName]) c[e.CompanyName] = e;
            return c;
          }, {})
        );
        setAllCompaniesRemoveDuplicateArr(removeDuplicateCompany);
      })
      .catch((err) => alert("Unable to get companies from database.", err));
  };

  const selectCompanyLoadProjectDescription = (e) => {
    setConsolidatedSubCategories([])
    let selCompanyName = e.target[e.target.selectedIndex].getAttribute("value")
    setSelectedCompanyName(selCompanyName)
    console.log("company selected", e.target[e.target.selectedIndex].getAttribute("data-companyid"));
    let selectedCompanyId = e.target[e.target.selectedIndex].getAttribute("data-companyid")
    console.log(selectedCompanyId)
    setSelectedCompanyIdState(selectedCompanyId)
    getProjectsByCompany(selectedCompanyId)
  };

  const getProjectsByCompany = (id) => {
    console.log("Getting projects by company", allProjectsByCompany)
    let projectsByCompanyId = allCompaniesProjectsArr.filter((project) => {
      return id === project.CompanyId
    }) 
    console.log(projectsByCompanyId)
    setAllProjectsByCompany(projectsByCompanyId)
  };

  const getProjectAndSubcategories = async () =>{
      await fetch("http://localhost:4040/GenericResultBuilderService/buildResults", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "KASH_OPERATIONS_PROJECT_SUB_CATEGORY_TABLE",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setAllSubCategories(res.data)
      })
      .catch((err) => alert("Unable to get project subcategories from database.", err));
  }

  const filterTasksBySubCategory = (subCategories) => {
    allTasksBySubCategory = subCategories.filter((task) => {
      return task.ProjectSubTaskId 
    })
  }

  const populateSubAssignmentsWorkArea = (e) => {
    console.log("project sub assignments", e.target[e.target.selectedIndex].getAttribute("data-value"));
    let selectedProjectSowId = e.target[e.target.selectedIndex].getAttribute("data-sowid");
    setSelectedProjectSowIdState(selectedProjectSowId)
    console.log(allSubCategories)
    let subCatBySowId  = allSubCategories.filter((subCat) => {
      return selectedProjectSowId === subCat.SowId
    })
    subCategoriesByProject = subCatBySowId
    setSubCategoriesByProjectState(subCatBySowId)
    // filterTasksBySubCategory(subCategoriesByProject)
    console.log(subCategoriesByProject)
    // console.log(allTasksBySubCategory)
    let filteredSubCats = Object.values(
      subCategoriesByProject.reduce((c, e) => {
        if (!c[e.SubTaskTitle]) c[e.SubTaskTitle] = e;
        return c;
      }, {})
    );
    console.log(filteredSubCats)
    setConsolidatedSubCategories(filteredSubCats)
  };

  const closeEditWorkArea = () => {
    console.log(editAddSubCat.current)
    setShowCreateNewSubCategory(false)
  }

  const addProjectSubCategory = async (sowId, subCatId, subCatTitle) => {
    console.log("Add sub category to selected project by SOW ID", sowId, subCatId, subCatTitle)
    setShowCreateNewSubCategory(true)
  }

  const saveProjectSubCategory = async (newSubCategory) => {
   console.log("save project sub category", newSubCategory)
  }

  const addTaskToSubCategory = async (projectId,subCatTitle, subCatId, segment1) => {
    console.log("Add task to sub category",  projectId, subCatTitle, subCatId, segment1)
    // add task to existing sub category. Validate if task name field is filled out
    if (segment1 === undefined || segment1 === "") {
      alert("Add a task name to add to sub category.")
    } else {
      console.log("run fetch to add task to sub cat")
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
                data: [
                    {
                    SowId: projectId,
                    ProjectSubTaskId: subCatId,
                    SubTaskTitle: subCatTitle,
                    Segment2: "",
                    Segment1: segment1,
                    Segment3: ""
                  },
                ],
                _keyword_: "KASH_OPERATIONS_PROJECT_SUB_CATEGORY_TABLE",
                secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
              }),
            }
          );
          const data = await response.json();
          // enter you logic when the fetch is successful
          console.log("Added to task to sub category table", data);
        } catch (error) {
          // enter your logic for when there is an error (ex. error toast)
          console.log(error);
          alert("Unable to add task.")
        }
    }
  }

  const validateRequiredInputs = (e) => {
    // e.preventDefault()
    // validate inputs
    console.log("Validate inputs")
    console.log("company name", companyName.current.value)
    console.log("sub cat Id", newWorkAreaIdInput.current.value)
    console.log("sub cat name", newWorkAreaInput.current.value)
    console.log("project", projectDescription.current.value)
    // run function to edit project details
    // create sub-assignment for project
    // open confirmation portal function
    if(companyName.current.value && newWorkAreaIdInput.current.value && newWorkAreaInput.current.value && projectDescription.current.value) {
      alert("Fill out all of the above fields")
    } else {
      addProjectSubCategory(selectedProjectSowIdState,newWorkAreaIdInput.current.value,newWorkAreaInput.current.value )
    }
  };

   const areYouSure = (e) => {
    console.log("delete confirmation", e.target)
    //                 document.getElementById('removeconfirmpopup').value = "";
    confirmationModal.current.showModal();
   }

   const closeConfirmationModal = () => {
    confirmationModal.current.close()
   }

   const deleteWorkArea = (sowId, taskId) => {
    console.log("delete button clicked")
   }

  return (
    <div className="add-sub-assignment-page--body">
      <main className="add-sub-assignment__main-section max-width--main-container">
        <h1 className="add-sub-assignment-title form-page-title--lg-1">
          Edit Project Details
        </h1>
        <div className="edit_page__return-link-holder">
          <Link to="/clients-hub" className="return-link">
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
            <p className="return-link-text">Return to Clients</p>
          </Link>
        </div>
        <div className="add-sub-assignment--content-holder">
          <form className="add-sub-assignment--form"
          // onSubmit={validateRequiredInputs}
          >
            <div className="add-sub-assignment--form--edit-project-details">
              <label
                for="add-sub-assignment-form--company-name-input"
                className="add-sub-assignment-form--company-name-label"
              >
                Company Name
                <select
                  onChange={selectCompanyLoadProjectDescription}
                  ref={companyName}
                  className="add-sub-assignment-form--company-name-input"
                  id="add-sub-assignment-form--company-name-input"
                  name="add-sub-assignment-form--company-name-input"
                  required="required"
                >
                  <option value="">- Choose A Company -</option>
                  {allCompaniesRemoveDuplicateArr.map((companyProject, i) => {
                    return <option key={i} value={companyProject.CompanyName} data-companyid={companyProject.CompanyId} data-sowid={companyProject.SowId}>{companyProject.CompanyName}</option>
                  })}
                </select>
              </label>

              <label
                for="add-sub-assignment-form--project-description-input"
                className="add-sub-assignment-form--project-description-label"
              >
                Project Description
                <select
                  onChange={populateSubAssignmentsWorkArea}
                  className="add-sub-assignment-form--project-description-input"
                  id="add-sub-assignment-form--project-description-input"
                  name="add-sub-assignment-form--project-description-input"
                  ref={projectDescription}
                  required="required"
                >

                  <option value="" selected="true"></option>
                  {allProjectsByCompany.map((project) => {
                    return <option data-sowid={project.SowId}>{project.CompanyName} - {project.ProjectCategory} ({project.SowId})</option>
                  })}
                </select>
              </label>
            </div>
            {/* 
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
<!--------------------------------------EDIT PROJECT DETAILS----------------DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!-------JUST UNCOMMENT IT and make it work while you're at it------------------------->
<!--------------------------------------------------------WORK IN PROGRESS-------------------------------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
                <!--<div className="sub-assignment-estimates">-->
                    
                <!--    <label for="add-sub-assignment-form--change-status-input" className="add-sub-assignment-form--change-status-label">-->
                <!--        Change Status-->
                <!--        <select onchange="" className="add-sub-assignment-form--change-status-input" id="add-sub-assignment-form--change-status-input" name="add-sub-assignment-form--change-status-input">-->
                <!--            <option value="">-->
                <!--            </option>-->
                <!--        </select>-->
                <!--    </label>-->

                <!--    <div className="date-estimates-holder">-->

                <!--        <label for="add-sub-assignment--start-date-input" className="add-sub-assignment--start-date-label">-->
                <!--            Change Start Date-->
                <!--            <input type="date" className="add-sub-assignment-form--form-input add-sub-assignment--start-date-input" id="add-sub-assignment--start-date-input" name="add-sub-assignment--start-date-input" required="required">-->
                <!--        </label>-->

                <!--        <label for="add-sub-assignment--end-date-input" className="add-sub-assignment--end-date-label">-->
                <!--            End Date-->
                <!--            <input type="date" className="add-sub-assignment-form--form-input add-sub-assignment--end-date-input" id="add-sub-assignment--end-date-input" name="add-sub-assignment--end-date-input" required="required">-->
                <!--        </label>-->
                        
                <!--    </div>-->

                <!--    <label for="add-sub-assignment--estimated-hours-input" className="add-sub-assignment--estimated-hours-label">-->
                <!--        Change Estimated Hours-->
                <!--        <input type="number" step="1" className="add-sub-assignment-form--form-input add-sub-assignment--estimated-hours-input" id="add-sub-assignment--estimated-hours-input" name="add-sub-assignment--estimated-hours-input">-->
                <!--    </label>-->

                <!--</div>-->
                
                <!-- <button onClick="" id="add-sub-assignment-form--submit-changes-button" className="add-sub-assignment-form--submit-changes-button">-->
                <!--    Submit Changes-->
                <!--</button>-->
                
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
 */}
          {/* </form> */}

          <div className="add-sub-assignment-details-holder-container">
            <h2 className="sub-assignment-title form-page-title--md-1">
              SUB-ASSIGNMENTS
              <span
                id="subAssignmentInfoIcon"
                className="material-symbols-outlined sub-assignment-help-icon"
                alt="help-icon"
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </span>
            </h2>
            <div className="add-sub-assignment-details-form--add-sub-assignment-details">
              {/* <AddSubCategoryForm addSubCategory={addProjectSubCategory} sowId={selectedProjectSowIdState} createBtnDisabled={createBtnDisabled}/> */}
                
                <form className="add-sub-assignment-input-area">
                <div className="add-sub-assignment-workspace-form--form-input--plus">
                  <svg
                    id="addWorkspaceBtn"
                    className="add-sub-assignment-details-form--add-sub-assignment-button-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0,0,256,256"
                    width="25"
                    height="25"
                    fillRule="nonzero"
                  >
                    <g
                      fill="#e7549a"
                      fillRule="nonzero"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <path d="M0,256v-256h256v256z" id="bgRectangle"></path>
                    </g>
                    <g
                      fill="#ffffff"
                      fill-rule="evenodd"
                      stroke="none"
                      strokeWidth="1"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeMiterlimit="10"
                      strokeDasharray=""
                      strokeDashoffset="0"
                      fontFamily="none"
                      fontWeight="none"
                      fontSize="none"
                      textAnchor="none"
                      style={{ mixBlendMode: "normal" }}
                    >
                      <g transform="scale(10.66667,10.66667)">
                        <path d="M11,2v9h-9v2h9v9h2v-9h9v-2h-9v-9z"></path>
                      </g>
                    </g>
                  </svg>
                </div>

                <div className="add-sub-assignment-workspace-form--form-input--workspace-input">
                  <input
                    id="newWorkAreaInput"
                    className="add-sub-assignment-details-form--form-input add-workspace"
                    type="text"
                    placeholder="Work Area"
                    required
                    ref={newWorkAreaInput}
                  />
                </div>

                <div className="add-sub-assignment-workspace-form--form-input--task-area-input">
                  <input
                    id="newWorkAreaIdInput"
                    className="add-sub-assignment-details-form--form-input add-task-area"
                    type="text"
                    placeholder="Work Area ID"
                    required
                    ref={newWorkAreaIdInput}
                  />
                </div>

                <button
                  id="createWorkAreaBtn"
                  className="add-sub-assignment-workspace-form--add-button"
                  type="submit"
                  // disabled={props.createBtnDisabled}
                  onClick={validateRequiredInputs}
                  // onSubmit={validateRequiredInputs}
                >
                  Create Work Area
                </button>
              </form> 

              <div
                className="add-sub-assignment-view-workspace-task-area"
                id="workspacetaskarea"
                ref={subCategoryContainer}
              >
                <div>
                {/* Conditionally Show the create new sub category UI */}
                {showNewSubCategory ? 
                  <SaveNewSubCategory close={closeEditWorkArea} subCatName={newWorkAreaInput.current.value}/>
                  :
                  ""
                }
                </div>
                {console.log(consolidatedSubCategories)}
                {
                  consolidatedSubCategories.map((subCat) => {
                    return <ProjectSubCategory 
                    subCategory={subCat} 
                    allTasksBySubCategory={subCategoriesByProjectState} addTaskToSubCat={addTaskToSubCategory}
                    deleteSubCatConfirmation={areYouSure}
                    projectId= {subCat.SowId}
                    subCatTitle={subCat.SubTaskTitle}
                    subCatId={subCat.ProjectSubTaskId}
                    />
                  })

                }
              </div>
            </div>
          </div>
          </form>
          <dialog id="myModal" className="confirm-delete-dialog-box" ref={confirmationModal}>
             <div id="confirmmsgdiv" className="modal-dialog modal-confirm">
                  <div className="modal-content">
                      <div className="modal-header flex-column">						
                          <h4 className="modal-title w-100">Confirm Delete</h4>	
                          <button onClick={closeConfirmationModal} type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div id="removeconfirmpopup" className="modal-body">
                          <p>Are you sure you want to delete <b>Sub Category or Segment</b>? </p>    				
                      </div>
                      <div className="modal-footer justify-content-center">
                          <button onClick={closeConfirmationModal} type="button" className="modal-btn btn-secondary" data-dismiss="modal">Cancel</button>
                          <button type="button" className="modal-btn btn-danger" onClick={deleteWorkArea}>Delete</button>
                      </div>
                  </div>
              </div>
          </dialog>
        </div>
      </main>
    </div>
  );
}

export default EditProject;
