import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import './UserManagement.css';
import PopUp from "./PopUp";

const UserManagement = () => {
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState(0);
    const [newDOB, setNewDOB] = useState('');
    const [newSal, setNewSal] = useState(0);
    const [newDept, setNewDept] = useState('');
    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, 'users');

    //   Functions for filters
    const [filterName, setFilterName] = useState('');
    const [sortFieldBy, setSortFIeldBy] = useState('Name');
    const [sortOrderBy, setSortOrderBy] = useState('asc');
    const [highlightCreateFields, setHighlightCreateFields] = useState(false); 
    const [highlightTable, setHighlightTable] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const showPopupHandler = () => setShowPopUp(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setShowPopUp(false);
      }, 2000);
     return () => clearTimeout(timer);
     }, [showPopUp]);
     let popup = null;
     if(showPopUp) {
       popup = <PopUp />;
      }

    const createUser = async () => {
        await addDoc(usersCollectionRef, { Name: newName, Age: newAge, DOB: newDOB, Sal: newSal, Dept: newDept });
        fetchUsers();
        setNewName('');
        setNewAge(0);
        setNewDOB('');
        setNewSal(0);
        setNewDept('');
        setHighlightTable(true);
        setTimeout(() => {
            setHighlightTable(false); 
        }, 700);
        showPopupHandler();
    };
    
    const updateUser = async () => {
        const updateData = doc(db, 'users', id);
        await updateDoc(updateData, { Name: newName, Age: newAge, DOB: newDOB, Sal: newSal, Dept: newDept });
        setShow(false);
        setNewName('');
        setNewAge(0);
        setNewDOB('');
        setNewSal(0);
        setNewDept('');
        fetchUsers();
        setHighlightTable(true);
        setTimeout(() => {
            setHighlightTable(false); 
        }, 700);
        showPopupHandler();
    };

    const editUser = async (id, name, age, dob, sal, dept) => {
        scrollToTop();
        setNewName(name);
        setNewAge(age);
        setNewDOB(dob);
        setNewSal(sal);
        setNewDept(dept);
        setId(id);
        setShow(true);
        setHighlightCreateFields(true); 
        setTimeout(() => {
            setHighlightCreateFields(false); 
        }, 700);
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            await deleteDoc(doc(db, "users", id));
            fetchUsers();
            showPopupHandler();
            // window.alert("Employee data deleted successfully.");
        }
    };

    //   Filters
    const handleFilterChange = (event) => {
        setFilterName(event.target.value);
    };
    const handleSortFieldChange = (event) => {
        const sortByOrder = event.target.value;
        setSortFIeldBy(sortByOrder);
        fetchUsers(event.target.value,sortOrderBy);
    };
    const handleSortOrderChange = (event) => {
        const sortByField = event.target.value;
        setSortOrderBy(sortByField);
        fetchUsers(sortFieldBy,event.target.value);
    }

    const filteredUsers = users.filter((user) =>
        user.Name.toLowerCase().includes(filterName.toLowerCase()) ||
        user.Dept.toLowerCase().includes(filterName.toLowerCase())
    );
    
    //  Fetch employee data
    useEffect(() => {
        fetchUsers(sortFieldBy, sortOrderBy);
    }, [sortFieldBy, sortOrderBy]);

    const fetchUsers = async () => {
        const q = query(usersCollectionRef, orderBy(sortFieldBy, sortOrderBy));
        const data = await getDocs(q);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return (
        <div className="UserManagement">
            {popup}
            
            {/* Filter by name and Department */}

            <div id="searchBox">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    value={filterName}
                    placeholder="Search by Name or Department..."
                    onChange={handleFilterChange}
                />
            </div>

            <div class="space"></div>

            {/* Create or edit Employee data */}
            <div class="createFields" className={`createFields ${highlightCreateFields ? 'highlight' : ''}`}>
                <div class="createFieldRows">
                    <h4>Name</h4>
                    <input
                        value={newName}
                        placeholder="Name..."
                        onChange={(event) => {
                            setNewName(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Age</h4>
                    <input
                        type="number"
                        value={newAge}
                        placeholder="Age..."
                        onChange={(event) => {
                            setNewAge(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Date of Birth</h4>
                    <input
                        type="date"
                        value={newDOB}
                        placeholder="Date of Birth..."
                        onChange={(event) => setNewDOB(event.target.value)}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Salary</h4>
                    <input
                        type="number"
                        value={newSal}
                        placeholder="Salary..."
                        onChange={(event) => {
                            setNewSal(event.target.value);
                        }}
                    />
                </div>
                <div class="createFieldRows">
                    <h4>Department</h4> 
                    <input
                        value={newDept}
                        placeholder="Department..."
                        onChange={(event) => {
                            setNewDept(event.target.value);
                        }}
                    />
                </div>
            
            {!show ? <button className={`createButton ${highlightTable ? 'highlight' : ''}`} onClick={createUser}> Create User </button> :
                    <button className={`createButton ${highlightTable ? 'highlight' : ''}`} onClick={updateUser}> Update User </button>}
            </div>
            
            <div class="space"></div>

            {/* Sort by Field and Order */}
            <div class="sortContainer">
                <div class="sortControls">
                    <i id="sortIcon" class="fa-solid fa-arrow-up-wide-short"></i>
                    <select name="sortFieldBy" id="sortField" value={sortFieldBy} onChange={handleSortFieldChange}>
                        <option value="Name">Name</option>
                        <option value="DOB">Date of Birth</option>
                        <option value="Sal">Salary</option>
                    </select>
                    <select name="sortOrderBy" id="sortOrder" value={sortOrderBy} onChange={handleSortOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
            
            <table className={`dataTable ${highlightTable ? 'highlight' : ''}`}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                        <th>Salary</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.Name}</td>
                            <td>{user.Age}</td>
                            <td>{user.DOB}</td>
                            <td>{parseFloat(user.Sal).toLocaleString()}</td>
                            <td>{user.Dept}</td>
                            <td>
                                <button class="actionOptions" id="editButton" onClick={() => editUser(user.id, user.Name, user.Age, user.DOB, user.Sal, user.Dept)}>Edit</button>
                                <button class="actionOptions" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div class="space"></div>
        </div>
    );
};

export default UserManagement;
